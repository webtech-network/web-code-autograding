// lint.js
const { ESLint } = require("eslint");

(async function main() {
  // Cria uma instância do ESLint, podendo configurar opções extras se precisar
  const eslint = new ESLint({
    // Exemplo de opções (todas opcionais):
    // fix: true,           // Tentar consertar problemas automaticamente
    // overrideConfigFile: "meu_eslint_config.json", // Definir o arquivo de config
    // useEslintrc: false,  // Ignora o .eslintrc e só usa o overrideConfigFile
    // baseConfig: {...},   // Definir regras diretamente
  });

  // Indique os arquivos ou diretórios que quer analisar
  const results = await eslint.lintFiles(["tests/**/*.js"]);

  // Caso queira formatar a saída
  const formatter = await eslint.loadFormatter("stylish");
  const resultText = formatter.format(results);

  // Exibe o resultado
  console.log(resultText);

  // Se estiver usando a opção `fix: true`, salve as correções em disco:
  await ESLint.outputFixes(results);
})().catch((error) => {
  process.exitCode = 1;
  console.error(error);
});
