const { execSync } = require('child_process');
const fs = require('fs');

function validateGit(rules) {
    let baseScore = 70;
    let minScore = 10;
    let maxBonus = 30;
    let maxPenalty = -40;
    let report = [];
    let score = baseScore;

    // 📌 0. Verificação de Configuração
    if (!rules) {
        report.push("❌ Arquivo de configuração ausente");
        score = 0;
        return { report, score };
    }

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
            report.push(`⚠️ Número mínimo de commits não atendido (${commitCount}/${rules.minCommits}) (-10 pontos)`);
            score -= 10;
        } else {
            report.push(`✅ Número de commits suficientes (${commitCount})`);
        }
    }

    // 📌 3. Verificação do Número de Tags
    if (rules.minTags) {
        const tagCount = parseInt(execSync('git tag | wc -l').toString().trim(), 10);
        if (tagCount < rules.minTags) {
            report.push(`⚠️ Número mínimo de tags não atendido (${tagCount}/${rules.minTags}) (-10 pontos)`);
            score -= 10;
        } else {
            report.push(`✅ Número de tags suficientes (${tagCount})`);
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
            report.push(`⚠️ Número mínimo de merges não atendido (${mergeCount}/${rules.minMerges}) (-3 pontos)`);
            score -= 3;
        } else {
            report.push(`✅ Merges suficientes (${mergeCount})`);
        }
    }

    // 📌 6. Verificação do Número de Linhas Modificadas
    if (rules.minLinesChanged) {
        const linesChanged = parseInt(execSync("git log --pretty=tformat: --numstat | awk '{ add += $1 } END { print add }'").toString().trim(), 10);
        if (linesChanged < rules.minLinesChanged) {
            report.push(`⚠️ Poucas linhas modificadas (${linesChanged}/${rules.minLinesChanged}) (-10 pontos)`);
            score -= 10;
        } else {
            report.push(`✅ Linhas modificadas suficientes (${linesChanged})`);
        }
    }

    // 📌 7. Verificação de Entradas no `.gitignore`
    if (rules.checkGitIgnore) {
        if (fs.existsSync('.gitignore')) {
            report.push(`✅ Arquivo .gitignore presente`);
            if (requiredGitIgnoreEntries) {
                const gitignoreContent = fs.readFileSync('.gitignore', 'utf-8');
                rules.requiredGitIgnoreEntries.forEach(entry => {
                    if (!gitignoreContent.includes(entry)) {
                        report.push(`⚠️ Entrada ausente no .gitignore: ${entry} (-2 pontos)`);
                        score -= 2;
                    } else {
                        report.push(`✅ Entrada encontrada no .gitignore: ${entry}`);
                    }
                });
            }
        } else {
            report.push(`⚠️ Arquivo .gitignore ausente (-10 pontos)`);
            score -= 10;
        }
    }

    // 📌 8. Verificação de Arquivos Obrigatórios
    if (rules.requiredFiles) {
        rules.requiredFiles.forEach(file => {
            if (!fs.existsSync(file)) {
                report.push(`⚠️ Arquivo obrigatório ausente: ${file} (-5 pontos)`);
                score -= 5;
            } else {
                report.push(`✅ Arquivo obrigatório encontrado: ${file}`);
            }
        });
    }

    // 📌 9. Bonificação por Boas Práticas
    let totalBonus = 0;

    // ✅ Commits semânticos
    const semanticCommits = execSync('git log --oneline').toString().split("\n").filter(line => /\b(feat|fix|refactor|docs|test|chore):/.test(line));
    if (semanticCommits.length > 0) {
        report.push(`🔹 Commits semânticos detectados (+3 pontos | limite 15 pontos)`);
        totalBonus += 3 * Math.min(5, semanticCommits.length);
    }

    // ✅ Uso de Pull Requests
    if (fs.existsSync('.github/workflows') || fs.existsSync('Jenkinsfile')) {
        report.push(`🔹 Existência de workflows configurados (+5 pontos)`);
        totalBonus += 5;
    }

    // ✅ Presença de `CONTRIBUTING.md` e `LICENSE`
    if (fs.existsSync('CONTRIBUTING.md')) {
        report.push(`🔹 Arquivo CONTRIBUTING.md encontrado (+5 pontos)`);
        totalBonus += 5;
    }
    if (fs.existsSync('LICENSE')) {
        report.push(`🔹 Arquivo LICENSE encontrado (+5 pontos)`);
        totalBonus += 5;
    }

    // Totaliza a bonificação, limitando ao máximo permitido
    totalBonus = Math.min(totalBonus, maxBonus);
    
    // Reporta detalhes da pontuação base, bônus e penalidades
    report.push ('.');
    report.push(`-------- 📏 Detalhes de Pontuação --------`)
    report.push(`📊 Pontuação base: ${score}`)
    report.push(`🔺 Bonificação: ${totalBonus}`);
    
    // Informa detalhes das regras básicas como pontuação de base, mínimos e máximos de bônus e penalidades
    report.push ('.');
    report.push(`-------- 📏 Regras de Pontuação --------`)
    report.push(` Nota base com itens requeridos: ${baseScore}, Mínimo: ${minScore}, Máximo: 100`);
    report.push(`⚠️ Itens requeridos: ${rules.requiredBranches.length} branches, ${rules.minCommits} commits, ${rules.minTags} tags, ${rules.minMerges} merges, ${rules.minLinesChanged} linhas modificadas`);
    report.push(`🔹 Possibilidades de bonificação: 
    - Commits semânticos (palavras-chave: feat | fix | refactor | docs | test | chore) (+3 pontos | limite 9 pontos)
    - Uso de workflows (+5 pontos)
    - Arquivo CONTRIBUTING.md (+5 pontos)
    - Arquivo LICENSE (+5 pontos)`);
    report.push(`🔺 Bonificação Máxima: ${maxBonus}`);
    
    // 📌 Garantia de que a nota final fique entre 10 e 100
    score += totalBonus;
    score = Math.max(minScore, Math.min(score, 100));

    return {
        report,
        score
    };
}

module.exports = validateGit;