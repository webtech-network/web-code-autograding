// const fs = require('fs');
// const { ESLint } = require('eslint');
// const espree = require('espree');

async function validateJS(code, rules) {
    // const report = [];
    // let baseScore = 80;
    // let minScore = 10;
    // let maxBonus = 20;
    // let maxPenalty = -30;
    // const maxItemBonus = 5;
    // const maxItemPenalty = 5;

    // let bonus = 0;
    // let penalty = 0;

    // const lines = code.split('\n').map(l => l.trim());
    // const lineCount = lines.filter(l => l && !l.startsWith('//')).length;

    // let ast;
    // try {
    //     ast = espree.parse(code, { ecmaVersion: 2022, sourceType: 'module' });
    // } catch (e) {
    //     report.push("❌ Erro de sintaxe no código (-5 pontos)");
    //     baseScore -= 5;
    //     ast = null;
    // }

    // // 📌 ESLint análise
    // if (rules.bonusChecks.eslintClean || rules.penaltyChecks.eslintErrors) {
    //     const eslint = new ESLint({ useEslintrc: false, baseConfig: { extends: 'eslint:recommended' } });
    //     const results = await eslint.lintText(code);
    //     const messages = results[0].messages;
    //     const errors = messages.filter(m => m.severity === 2);

    //     if (rules.bonusChecks.eslintClean && errors.length === 0) {
    //         report.push(`🔹 ESLint não encontrou erros (+2 pontos)`);
    //         bonus += 2;
    //     }

    //     if (rules.penaltyChecks.eslintErrors && errors.length > 0) {
    //         const errorCount = errors.length;
    //         const itemPenalty = Math.min(errorCount * 1, maxItemPenalty);
    //         report.push(`❌ ESLint encontrou ${errorCount} erro(s) (-${itemPenalty} pontos)`);
    //         penalty -= itemPenalty;
    //     }
    // }

    // // 📌 AST + Regex Checks
    // if (rules.requiredChecks.useModernFunctions) {
    //     const found = (code.match(/fetch|\.map\(|\.filter\(/g) || []).length;
    //     if (found === 0) {
    //         report.push("⚠️ Funções modernas não encontradas (-3 pontos)");
    //         baseScore -= 3;
    //     } else {
    //         report.push(`✅ Uso de funções modernas detectado (${found})`);
    //     }
    // }

    // if (rules.requiredChecks.noVar) {
    //     const count = (code.match(/[^a-zA-Z]var\s/g) || []).length;
    //     if (count > 0) {
    //         const itemPenalty = Math.min(count * 1, maxItemPenalty);
    //         report.push(`⚠️ Uso de 'var' detectado (${count} ocorrência(s)) (-${itemPenalty} pontos)`);
    //         baseScore -= itemPenalty;
    //     } else {
    //         report.push("✅ Nenhum uso de 'var'");
    //     }
    // }

    // if (rules.requiredChecks.modularCode && ast) {
    //     const funcNodes = ast.body.filter(node => node.type === 'FunctionDeclaration' || (node.type === 'VariableDeclaration' && /ArrowFunction/.test(node?.declarations?.[0]?.init?.type)));
    //     if (funcNodes.length === 0) {
    //         report.push("⚠️ Código não modularizado em funções (-4 pontos)");
    //         baseScore -= 4;
    //     } else {
    //         report.push("✅ Código modularizado em funções");
    //     }
    // }

    // if (rules.requiredChecks.usesControlStructures && ast) {
    //     const count = ast.body.filter(node => ['IfStatement', 'ForStatement', 'WhileStatement', 'SwitchStatement'].includes(node.type)).length;
    //     if (count === 0) {
    //         report.push("⚠️ Nenhuma estrutura de controle detectada (-3 pontos)");
    //         baseScore -= 3;
    //     } else {
    //         report.push(`✅ Estruturas de controle encontradas (${count})`);
    //     }
    // }

    // if (rules.requiredChecks.minLines && lineCount < rules.requiredChecks.minLines) {
    //     report.push(`⚠️ Código com poucas linhas úteis (${lineCount}) (-3 pontos)`);
    //     baseScore -= 3;
    // }

    // if (rules.requiredChecks.callsUserFunctions && ast) {
    //     const calls = ast.body.filter(node => node.type === 'ExpressionStatement' && node.expression.type === 'CallExpression');
    //     if (calls.length < 1) {
    //         report.push("⚠️ Nenhuma chamada a função do usuário (-3 pontos)");
    //         baseScore -= 3;
    //     } else {
    //         report.push("✅ Funções chamadas corretamente");
    //     }
    // }

    // // 📌 Bonificações
    // const bonusItems = [
    //     { rule: 'usesAsync', regex: /async\s+function|await\s+/, points: 3 },
    //     { rule: 'usesArrowFunctions', regex: /=>/, points: 2 },
    //     { rule: 'usesTemplateLiterals', regex: /`[^`]*\${[^}]+}[^`]*`/, points: 2 },
    //     { rule: 'usesSpread', regex: /\.\.\.\w+/, points: 2 },
    //     { rule: 'hasImports', regex: /import\s.+from\s|export\s/, points: 3 },
    //     { rule: 'hasComments', regex: /\/\/|\/\*/, points: 2 },
    //     { rule: 'hasErrorHandling', regex: /try\s*{[^}]+}\s*catch/, points: 2 }
    // ];

    // bonusItems.forEach(({ rule, regex, points }) => {
    //     if (rules.bonusChecks[rule]) {
    //         const matches = code.match(regex) || [];
    //         const score = Math.min(matches.length * points, maxItemBonus);
    //         if (score > 0) {
    //             report.push(`🔹 ${rule} detectado (${matches.length} ocorrência(s)) (+${score} pontos)`);
    //             bonus += score;
    //         }
    //     }
    // });

    // // 📌 Penalizações
    // const penaltyItems = [
    //     { rule: 'usesEval', regex: /eval\s*\(/, points: 5 },
    //     { rule: 'globalVariables', regex: /window\.|global\./, points: 3 },
    //     { rule: 'badNames', regex: /\b(x|data|temp)\b/, points: 2 }
    // ];

    // penaltyItems.forEach(({ rule, regex, points }) => {
    //     if (rules.penaltyChecks[rule]) {
    //         const matches = code.match(regex) || [];
    //         const score = Math.min(matches.length * points, maxItemPenalty);
    //         if (score > 0) {
    //             report.push(`❌ ${rule} detectado (${matches.length} ocorrência(s)) (-${score} pontos)`);
    //             penalty -= score;
    //         }
    //     }
    // });

    // // Comentários excessivos
    // if (rules.penaltyChecks.tooManyComments) {
    //     const commentLines = lines.filter(l => l.startsWith('//') || l.startsWith('/*')).length;
    //     if (commentLines / lines.length > 0.2) {
    //         report.push("⚠️ Comentários excessivos detectados (-2 pontos)");
    //         penalty -= 2;
    //     }
    // }

    // // Funções longas
    // if (rules.penaltyChecks.longFunctions) {
    //     const longFuncs = code.match(/function\s+\w+\s*\([^)]*\)\s*{[^}]{300,}}/g) || [];
    //     const score = Math.min(longFuncs.length * 2, maxItemPenalty);
    //     if (score > 0) {
    //         report.push(`⚠️ Funções longas detectadas (${longFuncs.length}) (-${score} pontos)`);
    //         penalty -= score;
    //     }
    // }

    // // Código duplicado
    // if (rules.penaltyChecks.duplicateCode) {
    //     const counts = {};
    //     lines.forEach(line => {
    //         if (line.length > 10) {
    //             counts[line] = (counts[line] || 0) + 1;
    //         }
    //     });
    //     const dups = Object.values(counts).filter(c => c > 1).length;
    //     const score = Math.min(dups * 2, maxItemPenalty);
    //     if (score > 0) {
    //         report.push(`⚠️ Código duplicado detectado (${dups} duplicações) (-${score} pontos)`);
    //         penalty -= score;
    //     }
    // }

    // bonus = Math.min(bonus, maxBonus);
    // penalty = Math.max(penalty, maxPenalty);

    // let finalScore = baseScore + bonus + penalty;
    // finalScore = Math.max(minScore, Math.min(finalScore, 100));

    // Mensagem temporária de alerta sobre elaboração do teste em andamento
    const report = []
    const finalScore = 0;
    report.push("⚠️ Teste de JS em elaboração, pontuação não disponível.");

    return {
        report,
        score: finalScore.toFixed(2)
    };
}

module.exports = validateJS;