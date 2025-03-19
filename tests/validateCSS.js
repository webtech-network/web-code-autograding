const fs = require('fs');

function validateCSS(css, rules) {
    // Normalização do CSS para evitar variações de formatação
    css = css.replace(/\s+/g, ' ').trim().toLowerCase();

    // Configuração inicial
    let baseScore = 60;
    let minScore = 10;
    let maxBonus = 30;
    let maxItemBonus = 6;
    let maxPenalty = -30;
    let maxItemPenalty = -6
    let report = [];
    let score = baseScore;

    // 📌 1. Verificação de Requisitos Obrigatórios
    if (rules.requiredChecks.checkResetCSS) {
        let regex = /@import\s+["']normalize\.css["']|[*]\s*{\s*margin:\s*0;\s*padding:\s*0;/;
        if (regex.test(css)) {
            report.push("✅ Reset/normalize.css encontrado");
        } else {
            report.push("❌ Reset/normalize.css não encontrado (-5 pontos)");
            score -= 5;
        }
    }

    if (rules.requiredChecks.checkRelativeUnits) {
        let pxMatches = css.match(/\b\d+px\b/g) || [];
        let relativeMatches = css.match(/\b\d+(%|em|rem|vh|vw)\b/g) || [];
        if (pxMatches.length > relativeMatches.length) {
            report.push("❌ Uso excessivo de `px` em vez de unidades relativas (-5 pontos)");
            score -= 5;
        } else {
            report.push("✅ Uso adequado de unidades relativas");
        }
    }

    if (rules.requiredChecks.checkCodeComments) {
        let commentMatches = css.match(/\/\*[\s\S]*?\*\//g) || [];
        if (commentMatches.length < 2) {
            report.push("❌ Poucos ou nenhum comentário explicativo (-5 pontos)");
            score -= 5;
        } else {
            report.push("✅ Comentários presentes no código");
        }
    }

    if (rules.requiredChecks.checkMinCSSRules) {
        let ruleMatches = css.match(/[a-zA-Z0-9_-]+\s*{[^}]+}/g) || [];
        if (ruleMatches.length < rules.requiredChecks.minCSSRules) {
            // mais 60% do mínimo [-10 pontos] 
            // mais de 40% do mínimo [-20 pontos]  
            // abaixo de 40% do mínimo [-30 pontos]
            let range = ruleMatches.length / rules.requiredChecks.minCSSRules;
            if (range > 0.6) {
                report.push(`❌ Volume de regras de 60 a 99.9% do volume mínimo (${range}%) (-15 pontos)`);
                score -= 15;
            } else if (range > 0.4) {
                report.push(`❌ Volume de regras de 40 a 59.9% do volume mínimo (${range}%) (-20 pontos)`);
                score -= 20;
            } else {
                report.push(`❌ Volume de regras abaixo de 40% do volume mínimo (${range}%) (-30 pontos)`);
                score -= 30;
            }
        } else {
            report.push(`✅ Número suficiente de regras CSS (${ruleMatches.length})`);
        }
    }

    if (rules.requiredChecks.checkRequiredProperties) {
        let requiredProperties = rules.requiredChecks.requiredProperties;
        let foundProperties = requiredProperties.filter(prop => new RegExp(`\\b${prop}\\s*:`, "gi").test(css));
        if (foundProperties.length < requiredProperties.length) {
            report.push(`❌ Poucas propriedades comuns encontradas (${foundProperties.length}/3) (-10 pontos)`);
            score -= 10;
        } else {
            report.push("✅ Propriedades comuns encontradas");
        }
    }

    // 📌 2. Bonificações
    let totalBonus = 0;

    if (rules.bonusChecks.variables) {
        let varMatches = css.match(/--[a-zA-Z-]+/g) || [];
        if (varMatches.length > 0) {
            report.push("🔹 Uso de variáveis CSS detectado (+2 pontos por item)");
            let bonus = 2 * varMatches.length;
            totalBonus = Math.min(bonus, maxItemBonus);
        }
    }

    if (rules.bonusChecks.flexbox) {
        let flexMatches = css.match(/display:\s*flex/) || [];
        if (flexMatches.length > 0) {
            report.push("🔹 Uso de flexbox detectado (+2 pontos por item)");
            let bonus = 2 * flexMatches.length;
            totalBonus = Math.min(bonus, maxItemBonus);
        }
    }

    if (rules.bonusChecks.grid) {
        if (css.match(/display:\s*grid/)) {
            report.push("🔹 Uso de grid detectado (+2 pontos por item)");
            totalBonus += 2;
        }
    }

    if (rules.bonusChecks.animations) {
        let animationMatches = css.match(/animation:\s*[\w-]+\s+\d+s|transition:\s*[\w-]+\s+\d+s/g) || [];
        if (animationMatches.length > 0) {
            report.push("🔹 Uso de animações CSS detectado (+2 pontos por item)");
            let bonus = 2 * animationMatches.length;
            totalBonus = Math.min(bonus, maxItemBonus);
        }
    }

    if (rules.bonusChecks.mediaQueries) {
        let mediaQueriesMatches = css.match(/@media\s+\(min-width:\s+\d+px\)/g) || [];
        if (mediaQueriesMatches.length > 0) {
            report.push("🔹 Uso de media queries responsivas detectado (+2 pontos por item)");
            let bonus = 2 * mediaQueriesMatches.length;
            totalBonus = Math.min(bonus, maxItemBonus);
        }
    }

    totalBonus = Math.min(totalBonus, maxBonus);
    score += totalBonus;

    // 📌 3. Penalizações
    let totalPenalty = 0;

    if (rules.penaltyChecks.important) {
        let importantMatches = css.match(/!important/g) || [];
        if (importantMatches.length > 3) {
            report.push(`❌ Uso excessivo de \`!important\` (${importantMatches.length} ocorrências) (-3 pontos)`);
            totalPenalty -= 3;
        }
    }

    if (rules.penaltyChecks.idSelectors) {
        let idSelectors = css.match(/#[a-zA-Z0-9_-]+\s*{/g) || [];
        if (idSelectors.length > 0) {
            report.push(`❌ Uso de seletores ID detectado (${idSelectors.length} ocorrências) (-5 pontos por item)`);
            let penalty = -3 * idSelectors.length;
            totalPenalty = Math.min(penalty, maxItemPenalty);
        }
    }

    if (rules.penaltyChecks.hexColors) {
        let hexColors = css.match(/#[0-9A-Fa-f]{3,6}/g) || [];
        if (hexColors.length > 0 && !css.includes("var(--")) {
            report.push(`❌ Uso de cores em hexadecimal sem variáveis (${hexColors.length} ocorrências) (-2 pontos)`);
            totalPenalty -= 2;
        }
    }

    if (rules.penaltyChecks.deepNesting) {
        let deepSelectors = css.match(/\S+\s+>\s+\S+\s+>\s+\S+\s+>/g) || [];
        if (deepSelectors.length > 0) {
            report.push(`❌ Aninhamento excessivo detectado (${deepSelectors.length} ocorrências) (-3 pontos)`);
            let penalty = -3 * deepSelectors.length;
            totalPenalty -= Math.min(penalty, maxItemPenalty);
        }
    }

    totalPenalty = Math.max(totalPenalty, maxPenalty);
    score += totalPenalty;

    // 📌 Garante que a nota fique entre 10 e 100
    score = Math.max(minScore, Math.min(score, 100));

    return {
        report,
        score
    };
}

module.exports = validateCSS;