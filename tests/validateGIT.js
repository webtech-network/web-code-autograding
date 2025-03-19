const { execSync } = require('child_process');
const fs = require('fs');

function validateGit(rules) {
    let baseScore = 80;
    let minScore = 10;
    let maxBonus = 20;
    let maxPenalty = -20;
    let report = [];
    let score = baseScore;

    // 📌 1. Verificação das Branches Obrigatórias
    if (rules.requiredBranches) {
        const branches = execSync('git branch -r')
            .toString()
            .split("\n")
            .map(b => b.trim().replace("origin/", ""));

        rules.requiredBranches.forEach(branch => {
            if (!branches.includes(branch)) {
                report.push(`⚠️ Branch obrigatória ausente: ${branch} (-5 pontos)`);
                score -= 5;
            } else {
                report.push(`✅ Branch encontrada: ${branch}`);
            }
        });
    }

    // 📌 2. Verificação do Número de Commits
    if (rules.minCommits) {
        const commitCount = parseInt(execSync('git rev-list --count HEAD').toString().trim(), 10);
        if (commitCount < rules.minCommits) {
            report.push(`⚠️ Poucos commits no repositório (${commitCount}/${rules.minCommits}) (-5 pontos)`);
            score -= 5;
        } else {
            report.push(`✅ Commits suficientes (${commitCount})`);
        }
    }

    // 📌 3. Verificação do Número de Tags
    if (rules.minTags) {
        const tagCount = parseInt(execSync('git tag | wc -l').toString().trim(), 10);
        if (tagCount < rules.minTags) {
            report.push(`⚠️ Poucas tags encontradas (${tagCount}/${rules.minTags}) (-3 pontos)`);
            score -= 3;
        } else {
            report.push(`✅ Tags suficientes (${tagCount})`);
        }
    }

    // 📌 4. Proibição de Merges sem Fast-Forward
    if (rules.forbidNoFFMerge) {
        const noFFMerges = execSync('git log --merges --pretty=%h').toString().trim().split("\n");
        if (noFFMerges.length > 0) {
            report.push(`⚠️ Merges sem fast-forward detectados (-4 pontos)`);
            score -= 4;
        } else {
            report.push(`✅ Nenhum merge sem fast-forward detectado`);
        }
    }

    // 📌 5. Verificação do Número de Merges
    if (rules.minMerges) {
        const mergeCount = parseInt(execSync('git log --merges --oneline | wc -l').toString().trim(), 10);
        if (mergeCount < rules.minMerges) {
            report.push(`⚠️ Poucos merges realizados (${mergeCount}/${rules.minMerges}) (-3 pontos)`);
            score -= 3;
        } else {
            report.push(`✅ Merges suficientes (${mergeCount})`);
        }
    }

    // 📌 6. Verificação do Número de Linhas Modificadas
    if (rules.minLinesChanged) {
        const linesChanged = parseInt(execSync("git log --stat --pretty=tformat: | awk '{ sum += $1 } END { print sum }'").toString().trim(), 10);
        if (linesChanged < rules.minLinesChanged) {
            report.push(`⚠️ Poucas linhas modificadas (${linesChanged}/${rules.minLinesChanged}) (-3 pontos)`);
            score -= 3;
        } else {
            report.push(`✅ Linhas modificadas suficientes (${linesChanged})`);
        }
    }

    // 📌 7. Verificação de Entradas no `.gitignore`
    if (rules.requiredGitIgnoreEntries) {
        if (fs.existsSync('.gitignore')) {
            const gitignoreContent = fs.readFileSync('.gitignore', 'utf-8');
            rules.requiredGitIgnoreEntries.forEach(entry => {
                if (!gitignoreContent.includes(entry)) {
                    report.push(`⚠️ Entrada ausente no .gitignore: ${entry} (-2 pontos)`);
                    score -= 2;
                } else {
                    report.push(`✅ Entrada encontrada no .gitignore: ${entry}`);
                }
            });
        } else {
            report.push(`⚠️ Arquivo .gitignore ausente (-2 pontos)`);
            score -= 2;
        }
    }

    // 📌 8. Verificação de Arquivos Obrigatórios
    if (rules.requiredFiles) {
        rules.requiredFiles.forEach(file => {
            if (!fs.existsSync(file)) {
                report.push(`⚠️ Arquivo obrigatório ausente: ${file} (-4 pontos)`);
                score -= 4;
            } else {
                report.push(`✅ Arquivo encontrado: ${file}`);
            }
        });
    }

    // 📌 9. Bonificação por Boas Práticas
    let totalBonus = 0;

    // ✅ Commits semânticos
    const semanticCommits = execSync('git log --oneline').toString().split("\n").filter(line => /\b(feat|fix|refactor|docs|test|chore):/.test(line));
    if (semanticCommits.length > 0) {
        report.push(`🔹 Commits semânticos detectados (+3 pontos)`);
        totalBonus += 3;
    }

    // ✅ Uso de Pull Requests
    if (fs.existsSync('.github/workflows') || fs.existsSync('Jenkinsfile')) {
        report.push(`🔹 CI/CD configurado (+3 pontos)`);
        totalBonus += 3;
    }

    // ✅ Presença de `CONTRIBUTING.md` e `LICENSE`
    if (fs.existsSync('CONTRIBUTING.md')) {
        report.push(`🔹 Arquivo CONTRIBUTING.md encontrado (+2 pontos)`);
        totalBonus += 2;
    }
    if (fs.existsSync('LICENSE')) {
        report.push(`🔹 Arquivo LICENSE encontrado (+2 pontos)`);
        totalBonus += 2;
    }

    totalBonus = Math.min(totalBonus, maxBonus);
    score += totalBonus;

    // 📌 Garantia de que a nota final fique entre 10 e 100
    score = Math.max(minScore, Math.min(score, 100));

    return {
        report,
        score
    };
}

module.exports = validateGit;