const cheerio = require('cheerio');
// const validator = require('html-validator');

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

function validateHTML(html, rules) {
    // Verifica se o HTML é válido
    if (!html) {
        return {
            report: ['❌ Nenhum conteúdo HTML encontrado'],
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

    // carrega o HTML no Cheerio
    const $ = cheerio.load(html);

    // --- Contabilização de pontos com HTML ---
    // Regras:
    // Até 80 pontos de nota básica
    //    - Todas as tags obrigatórias presentes (PENALIDADE: -3 por tag faltante)
    //    - Todos os atributos obrigatórios presentes (PENALIDADE: -2 por atributo faltante)
    //    - Volume de pelo menos 200 caracteres de texto (PENALIDADE: -5 por volume abaixo)
    //    - Quantidade de pelo menos 3 imagens (PENALIDADE: -2 por imagem faltante)
    //    - Quantidade de pelo menos 5 links (PENALIDADE: -2 por link faltante)

    // Até 20 pontos para bônus
    //    - Tags relevantes presentes (BÔNUS: +1 por tag relevante)
    //    - Atributos relevantes presentes (BÔNUS: +1 por atributo relevante)

    // Até 30 pontos para penalidades
    //    - Tags proibidas presentes (PENALIDADE: -2 por tag proibida)
    //    - Atributos proibidos presentes (PENALIDADE: -2 por atributo proibido)

    
    // Configuração inicial
    let baseScore = 60;
    let minScore = 10;
    let maxBonus = 40;
    let maxPenalty = -30;

    let report = [];
    let score = baseScore;

    // Contagem de ocorrências de tags
    function countOccurrences(selector) {
        return $(selector).length;
    }

    // 📌 Verificação de Tags Obrigatórias
    rules.requiredTags.forEach(tag => {
        if (countOccurrences(tag) === 0) {
            report.push(`⚠️ Tag obrigatória ausente: <${tag}> (-3 pontos)`);
            score -= 3;
        } else {
            report.push(`✅ Tag obrigatória encontrada: <${tag}>`);
        }
    });

    // 📌 Verificação de Atributos Obrigatórios
    rules.requiredAttributes.forEach(attr => {
        if ($(`[${attr}]`).length === 0) {
            report.push(`⚠️ Atributo obrigatório ausente: ${attr} (-2 pontos)`);
            score -= 2;
        } else {
            report.push(`✅ Atributo obrigatório encontrado: ${attr}`);
        }
    });

    // 📌 Verificação do Volume de Texto
    let textContent = $('body').text().replace(/\s+/g, ' ').trim();
    if (textContent.length < 300) {
        report.push(`⚠️ Texto abaixo de 200 caracteres (${textContent.length} caracteres) (-3 pontos)`);
        score -= 3;
    } else {
        report.push(`✅ Texto com volume adequado (${textContent.length} caracteres)`);
    }

    // 📌 Verificação de Imagens
    let imgCount = countOccurrences('img');
    if (imgCount < 3) {
        let missing = 3 - imgCount;
        report.push(`⚠️ Imagens insuficientes (${imgCount} encontradas, ${missing} faltando) (-${missing * 3} pontos)`);
        score -= missing * 3;
    } else {
        report.push(`✅ Quantidade suficiente de imagens (${imgCount})`);
    }

    // 📌 Verificação de Links
    let linkCount = countOccurrences('a');
    if (linkCount < 5) {
        let missing = 5 - linkCount;
        report.push(`⚠️ Links insuficientes (${linkCount} encontrados, ${missing} faltando) (-${missing * 3} pontos)`);
        score -= missing * 3;
    } else {
        report.push(`✅ Quantidade suficiente de links (${linkCount})`);
    }

    // 📌 Bonificação por Tags Relevantes
    let bonusPoints = 0;
    rules.relevantTags.forEach(tag => {
        let occurrences = countOccurrences(tag);
        if (occurrences > 0) {
            report.push(`🔹 Tag relevante encontrada: <${tag}> (+1 ponto | limite 2 pontos)`);
            bonusPoints += 1 * Math.min(2, occurrences);
        }
    });

    // 📌 Bonificação por Atributos Relevantes
    rules.relevantAttributes.forEach(attr => {
        let occurrences = $(`[${attr}]`).length;
        if (occurrences > 0) {
            report.push(`🔹 Atributo relevante encontrado: ${attr} (+1 ponto | limite 3 pontos)`);
            bonusPoints += 1 * Math.min(3, occurrences);
        }
    });

    // 📌 Penalização por Tags Proibidas
    let penaltyPoints = 0;
    rules.forbiddenTags.forEach(tag => {
        let occurrences = countOccurrences(tag);
        if (occurrences > 0) {
            report.push(`❌ Tag proibida encontrada: <${tag}> (${occurrences} ocorrência(s)) (-2 pontos | limite -10 pontos)`);
            penaltyPoints -= 2 * Math.min(5, occurrences);
        }
    });

    // 📌 Penalização por Atributos Proibidos
    rules.forbiddenAttributes.forEach(attr => {
        let occurrences = $(`[${attr}]`).length;
        if (occurrences > 0) {
            report.push(`❌ Atributo proibido encontrado: ${attr} (${occurrences} ocorrência(s)) (-2 pontos | limite -10 pontos)`);
            penaltyPoints -= 2 * Math.min(5, occurrences);
        }
    });

    // Aplicação do Bônus e Penalidade dentro dos limites
    bonusPoints = Math.min(bonusPoints, maxBonus);
    penaltyPoints = Math.max(penaltyPoints, maxPenalty);

    // Reporta detalhes da pontuação base, bônus e penalidades
    report.push ('.');
    report.push(`-------- 📏 Detalhes de Pontuação --------`)
    report.push(`📊 Pontuação base: ${score}`)
    report.push(`🔺 Bonificação: +${bonusPoints} pontos`
        + (bonusPoints > 0 ? ` (${rules.relevantTags.length} tags, ${rules.relevantAttributes.length} atributos)` : ''));
    report.push(`🔻 Penalidades: ${penaltyPoints}`
        + (penaltyPoints < 0 ? ` (${rules.forbiddenTags.length} tags, ${rules.forbiddenAttributes.length} atributos)` : ''));

    // Informa detalhes das regras básicas como pontuação de base, mínimos e máximos de bônus e penalidades
    report.push ('.');
    report.push(`-------- 📏 Regras de Pontuação --------`)
    report.push(` Nota base com itens requeridos: ${baseScore}, Mínimo: ${minScore}, Máximo: 100`);
    report.push(`🔺 Bonificação Máxima: ${maxBonus}`);
    report.push(`🔻 Penalidade Máxima: ${maxPenalty}`);
    report.push(`📝 Observação: A pontuação final é ajustada para ficar entre ${minScore} e 100 pontos.`);

    
    // 📌 Calcula nota final, garantindo que a nota final fique entre 10 e 100
    score += bonusPoints + penaltyPoints;
    score = Math.max(minScore, Math.min(score, 100));

    return {
        report,
        score
    };
}

module.exports = validateHTML;