const core = require('@actions/core')
const {execSync} = require('child_process')

const env = {
  PATH: process.env.PATH,
  FORCE_COLOR: 'true',
  DOTNET_CLI_HOME: '/tmp',
  DOTNET_NOLOGO: 'true',
  HOME: process.env.HOME,
}

function btoa(str) {
  return Buffer.from(str).toString('base64')
}

function generateResult(status, testName, command, message, duration, currentScore, maxScore) {
  return {
    version: 1,
    status,
    max_score: maxScore,
    tests: [
      {
        name: testName,
        status,
        score: status === 'pass' ? currentScore : 0,
        message,
        test_code: command,
        filename: '',
        line_no: 0,
        duration,
      },
    ],
  }
}

function getErrorMessageAndStatus(error, command) {
  if (error.message.includes('ETIMEDOUT')) {
    return { status: 'error', errorMessage: 'Command timed out' }
  }
  if (error.message.includes('command not found')) {
    return { status: 'error', errorMessage: `Unable to locate executable file: ${command}` }
  }
  if (error.message.includes('Command failed')) {
    return { status: 'fail', errorMessage: 'failed with exit code 1' }
  }
  return  { status: 'error', errorMessage: error.message }
}

function run() {
  const testName = core.getInput('test-name', {required: true})
  const setupCommand = core.getInput('setup-command')
  const command = core.getInput('command', {required: true})
  const procedure = core.getInput('procedure')
  const weight = core.getInput('weight')
  const timeout = parseFloat(core.getInput('timeout') || 10) * 60000 // Convert to minutes
  const maxScore = parseInt(core.getInput('max-score') || 0)

  let output = ''
  let startTime
  let endTime
  let result
  let currentScore = maxScore

  try {
    if (setupCommand) {
      execSync(setupCommand, {timeout, env, stdio: 'inherit'})
    }

    // se tiver um valor em procedure, carrega o arquivo de validação (tests/validator.js) e dispara a função
    // correspondente ao valor de procedure, obtendo do resultado a mensagem e a pontuação
    startTime = new Date()
    if (procedure) {
      const validator = require(`${process.env.GITHUB_WORKSPACE}/tests/validator.js`);
      const {report, score} = validator[procedure]()
      output = report.join('\n')
      currentScore = score
    } 
    else {
      // se não tiver um valor em procedure, executa o comando e captura a saída    
      output = execSync(command, {timeout, env, stdio: 'inherit'})?.toString()
    }
    endTime = new Date()

    finalCommand = procedure ? procedure : command
    result = generateResult('pass', testName, finalCommand, output, endTime - startTime, currentScore, maxScore)
  } catch (error) {
    endTime = new Date()
    const {status, errorMessage} = getErrorMessageAndStatus(error, command)
    result = generateResult(status, testName, command, errorMessage, endTime - startTime, currentScore, maxScore)
  } 

  core.setOutput('result', btoa(JSON.stringify(result)))
}

run()