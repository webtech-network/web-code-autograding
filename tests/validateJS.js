const { ESLint } = require('eslint');
const espree = require('espree');

// async function validateJS(code, rules) {
function validateJS(code, rules) {
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
    //     report.push(`❌ Erro de sintaxe no código (-5 pontos) [${e.message}]`);
    //     baseScore -= 5;
    //     ast = null;
    // }

    //            // 📌 ESLint análise
    //            //     try {
    //            //         // let eslintScoreImpact = 0;
    //            // console.log ('Realizando teste: bonusChecks.eslintClean')
    //            //         if (rules.bonusChecks.eslintClean || rules.penaltyChecks.eslintErrors) {
    //            //             const eslint = new ESLint();
    //            //             const results = await eslint.lintText(code);
    //            //             const messages = results[0].messages;
    //            //    
    //            //             const errors = messages.filter(m => m.severity === 2);
    //            //    
    //            //             if (rules.bonusChecks.eslintClean && errors.length === 0) {
    //            //                 report.push(`🔹 ESLint não encontrou erros (+2 pontos)`);
    //            //                 bonus += Math.min(2, maxItemBonus);
    //            //             }
    //            //    
    //            //             if (rules.penaltyChecks.eslintErrors && errors.length > 0) {
    //            //                 report.push(`❌ ESLint encontrou ${errors.length} erro(s) (-3 pontos)`);
    //            //                 penalty -= Math.min(3, maxItemPenalty);
    //            //             }
    //            //         }
    //            //     }
    //            //     catch (e) {
    //            //         report.push(`⛔️ Erro ao executar ESLint [${e.message}]`);
    //            //     }

//     // 📌 AST + Regex Checks
// console.log ('Realizando teste: requiredChecks.useModernFunctions')
//     if (rules.requiredChecks.useModernFunctions) {
//         const found = /fetch|\.map\(|\.filter\(/.test(code);
//         if (!found) {
//             report.push("⚠️ Funções modernas não encontradas (-3 pontos)");
//             baseScore -= Math.min(3, maxItemPenalty);
//         } else {
//             report.push("✅ Uso de funções modernas detectado");
//         }
//     }

// console.log ('Realizando teste: requiredChecks.noVar')
//     if (rules.requiredChecks.noVar && /[^a-zA-Z]var\s/.test(code)) {
//         report.push("⚠️ Uso de `var` detectado (-3 pontos)");
//         baseScore -= Math.min(3, maxItemPenalty);
//     }

// console.log ('Realizando teste: requiredChecks.modularCode')
//     if (rules.requiredChecks.modularCode && ast) {
//         const hasFunctions = ast.body.some(node => node.type === 'FunctionDeclaration' || node.type === 'VariableDeclaration' && /ArrowFunction/.test(node?.declarations?.[0]?.init?.type));
//         if (!hasFunctions) {
//             report.push("⚠️ Código não modularizado em funções (-4 pontos)");
//             baseScore -= Math.min(4, maxItemPenalty);
//         } else {
//             report.push("✅ Código modularizado em funções");
//         }
//     }

// console.log ('Realizando teste: requiredChecks.usesControlStructures')
//     if (rules.requiredChecks.usesControlStructures && ast) {
//         const found = ast.body.some(node => ['IfStatement', 'ForStatement', 'WhileStatement', 'SwitchStatement'].includes(node.type));
//         if (!found) {
//             report.push("⚠️ Nenhuma estrutura de controle detectada (-3 pontos)");
//             baseScore -= Math.min(3, maxItemPenalty);
//         } else {
//             report.push("✅ Estruturas de controle encontradas");
//         }
//     }

// console.log ('Realizando teste: requiredChecks.minLines')
//     if (rules.requiredChecks.minLines && lineCount < rules.requiredChecks.minLines) {
//         report.push(`⚠️ Código com poucas linhas úteis (${lineCount}) (-3 pontos)`);
//         baseScore -= Math.min(3, maxItemPenalty);
//     }

// console.log ('Realizando teste: requiredChecks.callsUserFunctions')
//     if (rules.requiredChecks.callsUserFunctions && ast) {
//         const calls = ast.body.filter(node => node.type === 'ExpressionStatement' && node.expression.type === 'CallExpression');
//         if (calls.length < 1) {
//             report.push("⚠️ Nenhuma chamada a função do usuário (-3 pontos)");
//             baseScore -= Math.min(3, maxItemPenalty);
//         } else {
//             report.push("✅ Funções chamadas corretamente");
//         }
//     }

//     // 📌 Bonificações
// console.log ('Realizando teste: bonusChecks.usesAsync')
//     if (rules.bonusChecks.usesAsync && /async\s+function|await\s+/.test(code)) {
//         report.push("🔹 Uso de async/await detectado (+3 pontos)");
//         bonus += Math.min(3, maxItemBonus);
//     }

// console.log ('Realizando teste: bonusChecks.usesArrowFunctions')
//     if (rules.bonusChecks.usesArrowFunctions && /=>/.test(code)) {
//         report.push("🔹 Uso de arrow functions (+2 pontos)");
//         bonus += Math.min(2, maxItemBonus);
//     }

// console.log ('Realizando teste: bonusChecks.usesTemplateLiterals')
//     if (rules.bonusChecks.usesTemplateLiterals && /`[^`]*\${[^}]+}[^`]*`/.test(code)) {
//         report.push("🔹 Uso de template literals (+2 pontos)");
//         bonus += Math.min(2, maxItemBonus);
//     }

// console.log ('Realizando teste: bonusChecks.usesSpread')
//     if (rules.bonusChecks.usesSpread && /\.{3}\w+/.test(code)) {
//         report.push("🔹 Uso de spread/rest detectado (+2 pontos)");
//         bonus += Math.min(2, maxItemBonus);
//     }

// console.log ('Realizando teste: bonusChecks.hasImports')
//     if (rules.bonusChecks.hasImports && /import\s.+from\s|export\s/.test(code)) {
//         report.push("🔹 Organização modular detectada (+3 pontos)");
//         bonus += Math.min(3, maxItemBonus);
//     }

// console.log ('Realizando teste: bonusChecks.hasComments')
//     if (rules.bonusChecks.hasComments && /\/\/|\/\*/.test(code)) {
//         report.push("🔹 Comentários encontrados (+2 pontos)");
//         bonus += Math.min(2, maxItemBonus);
//     }

// console.log ('Realizando teste: bonusChecks.hasErrorHandling')
//     if (rules.bonusChecks.hasErrorHandling && /try\s*{[^}]+}\s*catch/.test(code)) {
//         report.push("🔹 Uso de try/catch para tratamento de erros (+2 pontos)");
//         bonus += Math.min(2, maxItemBonus);
//     }

//     // 📌 Penalizações
// console.log ('Realizando teste: penaltyChecks.usesEval')
//     if (rules.penaltyChecks.usesEval && /eval\s*\(/.test(code)) {
//         report.push("❌ Uso de `eval()` detectado (-5 pontos)");
//         penalty -= Math.min(5, maxItemPenalty);
//     }

// console.log ('Realizando teste: penaltyChecks.tooManyComments')
//     if (rules.penaltyChecks.tooManyComments) {
//         const commentLines = lines.filter(l => l.startsWith('//') || l.startsWith('/*')).length;
//         if (commentLines / lines.length > 0.2) {
//             report.push("⚠️ Comentários excessivos detectados (-2 pontos)");
//             penalty -= Math.min(2, maxItemPenalty);
//         }
//     }

// console.log ('Realizando teste: penaltyChecks.globalVariables')
//     if (rules.penaltyChecks.globalVariables && /window\.|global\./.test(code)) {
//         report.push("❌ Uso de variáveis globais detectado (-3 pontos)");
//         penalty -= Math.min(3, maxItemPenalty);
//     }

// console.log ('Realizando teste: penaltyChecks.badNames')
//     if (rules.penaltyChecks.badNames && /\b(x|data|temp)\b/.test(code)) {
//         report.push("⚠️ Nomes de variáveis genéricos detectados (-2 pontos)");
//         penalty -= Math.min(2, maxItemPenalty);
//     }

// console.log ('Realizando teste: penaltyChecks.longFunctions')
//     if (rules.penaltyChecks.longFunctions) {
//         const longFuncs = code.match(/function\s+\w+\s*\([^)]*\)\s*{[^}]{300,}}/g) || [];
//         if (longFuncs.length > 0) {
//             report.push("⚠️ Funções longas detectadas (-2 pontos)");
//             penalty -= Math.min(2, maxItemPenalty);
//         }
//     }

// console.log ('Realizando teste: penaltyChecks.duplicateCode')
//     if (rules.penaltyChecks.duplicateCode) {
//         const counts = {};
//         lines.forEach(line => {
//             if (line.length > 10) {
//                 counts[line] = (counts[line] || 0) + 1;
//             }
//         });
//         if (Object.values(counts).some(c => c > 2)) {
//             report.push("⚠️ Código duplicado detectado (-3 pontos)");
//             penalty -= Math.min(3, maxItemPenalty);
//         }
//     }

//     // 📌 Cálculo final
//     bonus = Math.min(bonus, maxBonus);
//     penalty = Math.max(penalty, maxPenalty);

//     let finalScore = baseScore + bonus + penalty;
//     finalScore = Math.max(minScore, Math.min(finalScore, 100));

// console.log (report.join('\n'), '\n\n', finalScore)

    const report = [];
    const finalScore = 0;

    report.push('✳️ Validação de código JavaScript em construção...')    ;

    return {
        report,
        score: finalScore
    };
}

module.exports = validateJS;