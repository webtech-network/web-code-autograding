function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

function validateCSS(css, rules) {
    // Verifica se o CSS é válido
    if (!css) {
        return {
            report: ['❌ Nenhum conteúdo CSS encontrado'],
            score: 0
        };
    }

    // Verifica se as regras estão vazias {}
    if (isEmpty(rules)) {
        return {
            report: ['❌ Nenhuma regra de validação fornecida'],
            score: 0
        };
    }

    // Normalização do CSS para evitar variações de formatação
    css = css.replace(/\s+/g, ' ').trim().toLowerCase();

    // Configuração inicial
    let baseScore = 60;
    let minScore = 10;
    let maxBonus = 40;
    let maxItemBonus = 6;
    let maxPenalty = -30;
    let maxItemPenalty = -6

    let report = [];
    let score = baseScore;

    // 📌 1. Verificação de Requisitos Obrigatórios
    if (rules.requiredChecks.checkResetCSS) {
        let regex = /@import\s+["']normalize\.css["']|(?:\*|html|body)\s*{\s*margin:\s*0;\s*padding:\s*0;/;
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
        let percentual = foundProperties.length / requiredProperties.length;
        if (percentual < 0.6) {
            report.push(`❌ Poucas propriedades comuns encontradas - abaixo de 60% (${foundProperties.length}) (-10 pontos)`);
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
        let gridMatches = css.match(/display:\s*grid/) || [];
        if (gridMatches.length > 0) {
            report.push("🔹 Uso de grid detectado (+2 pontos por item)");
            let bonus = 2 * gridMatches.length;
            totalBonus = Math.min(bonus, maxItemBonus);
        }
    }

    if (rules.bonusChecks.animations) {
        let animationMatches = css.match(/animation:\s*[\w-]+\s+\d+s|transition:\s*[\w-]+\s+\d+s/g) || [];
        if (animationMatches.length > 0) {
            report.push("🔹 Uso de animações CSS detectado (+2 pontos por item | limite 10 pontos)");
            let bonus = 2 * animationMatches.length;
            totalBonus = Math.min(bonus, maxItemBonus);
        }
    }

    if (rules.bonusChecks.mediaQueries) {
        let mediaQueriesMatches = css.match(/@media\s*\([^)]*\)/g) || [];
        if (mediaQueriesMatches.length > 0) {
            report.push("🔹 Uso de media queries responsivas detectado (+2 pontos por item)");
            let bonus = 2 * mediaQueriesMatches.length;
            totalBonus = Math.min(bonus, maxItemBonus);
        }
    }


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

    // Aplicação do Bônus e Penalidade dentro dos limites
    totalBonus = Math.min(totalBonus, maxBonus);
    totalPenalty = Math.max(totalPenalty, maxPenalty);

    // Reporta detalhes da pontuação base, bônus e penalidades
    report.push ('.');
    report.push(`📊 Pontuação base: ${baseScore}`)
    report.push(`🔺 Bonificação: ${totalBonus}`);
    report.push(`🔻 Penalidades: ${totalPenalty}`)
    report.push(`📈 Nota final: ${score + totalBonus + totalPenalty} em 100`);

    // Informa detalhes das regras básicas como pontuação de base, mínimos e máximos de bônus e penalidades
    report.push ('.');
    report.push(`-------- 📏 Regras de Pontuação --------`)
    report.push(` Nota base com itens requeridos: ${baseScore}, Mínimo: ${minScore}, Máximo: 100`);
    report.push(`🔺 Bonificação Máxima: ${maxBonus} | Limite de ${maxItemBonus} pontos por item`);
    report.push(`🔹 Possibilidades de bonificação: 
        - Uso de variáveis CSS (+2 pontos por item)
        - Uso de flexbox (+2 pontos por item)
        - Uso de grid (+2 pontos por item)
        - Uso de animações CSS (+2 pontos por item)
        - Uso de media queries responsivas (+2 pontos por item)`);   
    report.push(`❌ Possibilidades de penalidades:
        - Uso excessivo de \`!important\` (-3 pontos)
        - Uso de seletores ID (-3 pontos por item)
        - Uso de cores em hexadecimal sem variáveis (-2 pontos)
        - Aninhamento excessivo (-3 pontos por item)`);          
    report.push(`🔻 Penalidade Máxima: ${maxPenalty}`);
    report.push(`📝 Observação: A pontuação final é ajustada para ficar entre ${minScore} e 100 pontos
        com base nos bônus e penalidades aplicados.`);
    
    
    // 📌 Calcula nota final, garantindo que a nota final fique entre 10 e 100
    score += totalBonus + totalPenalty;    
    score = Math.max(minScore, Math.min(score, 100));

    return {
        report,
        score
    };
}

module.exports = validateCSS;