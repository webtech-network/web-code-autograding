const { execSync } = require('child_process');

function getGitBranches() {
    return execSync('git branch --format="%(refname:short)"')
        .toString()
        .trim()
        .split('\n');
}

function getGitCommitCount() {
    return parseInt(execSync('git rev-list --count HEAD').toString().trim(), 10);
}

function getGitMerges() {
    return execSync('git log --merges --pretty=format:"%H"')
        .toString()
        .trim()
        .split('\n')
        .filter(hash => hash);
}

function getGitLinesChanged() {
    return parseInt(
        execSync('git log --pretty=tformat: --numstat | awk \'{sum+=$1+$2} END {print sum}\'')
            .toString()
            .trim(),
        10
    );
}

function validateGit(rules) {
    let results = { passed: [], failed: [] };

    // Verifica branches obrigatórias
    const branches = getGitBranches();
    rules.requiredBranches.forEach(branch => {
        if (branches.includes(branch)) {
            results.passed.push(`Branch '${branch}' encontrada.`);
        } else {
            results.failed.push(`Branch '${branch}' não encontrada.`);
        }
    });

    // Verifica quantidade minima de commits
    const commitCount = getGitCommitCount();
    if (commitCount < rules.minCommits) {
        results.failed.push(`Quantidade de commits (${commitCount}) abaixo do mínimo esperado (${rules.minCommits}).`);
    } else {
        results.passed.push(`Quantidade de commits (${commitCount}) dentro do esperado.`);
    }

    // Verifica merges sem fast-forward
    if (rules.forbidNoFFMerge) {
        const merges = getGitMerges();
        if (merges.length > 0) {
            results.failed.push(`Foram encontrados ${merges.length} merges no histórico. Verifique se foram revisados corretamente.`);
        } else {
            results.passed.push(`Nenhum merge sem fast-forward detectado.`);
        }
    }

    // Verifica quantidade mínima de linhas alteradas no histórico
    const linesChanged = getGitLinesChanged();
    if (linesChanged < rules.minLinesChanged) {
        results.failed.push(`Quantidade de linhas alteradas (${linesChanged}) abaixo do mínimo esperado (${rules.minLinesChanged}).`);
    }  
    else {
        results.passed.push(`Quantidade de linhas alteradas (${linesChanged}) dentro do esperado.`);
    }

    return results;
}

module.exports = validateGit;
