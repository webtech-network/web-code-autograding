const cheerio = require('cheerio');
const validator = require('html-validator');

function validateHTML(html, rules) {
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
    let baseScore = 80;
    let minScore = 10;
    let maxBonus = 20;
    let maxPenalty = -20;
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
        if (countOccurrences(tag) > 0) {
            report.push(`🔹 Tag relevante encontrada: <${tag}> (+1 ponto)`);
            bonusPoints += 1;
        }
    });

    // 📌 Bonificação por Atributos Relevantes
    rules.relevantAttributes.forEach(attr => {
        if ($(`[${attr}]`).length > 0) {
            report.push(`🔹 Atributo relevante encontrado: ${attr} (+1 ponto)`);
            bonusPoints += 1;
        }
    });

    // 📌 Penalização por Tags Proibidas
    let penaltyPoints = 0;
    rules.forbiddenTags.forEach(tag => {
        let count = countOccurrences(tag);
        if (count > 0) {
            report.push(`❌ Tag proibida encontrada: <${tag}> (${count} ocorrência(s)) (-2 pontos)`);
            penaltyPoints -= count * 2;
        }
    });

    // 📌 Penalização por Atributos Proibidos
    rules.forbiddenAttributes.forEach(attr => {
        let count = $(`[${attr}]`).length;
        if (count > 0) {
            report.push(`❌ Atributo proibido encontrado: ${attr} (${count} ocorrência(s)) (-2 pontos)`);
            penaltyPoints -= count * 2;
        }
    });

    // Aplicação do Bônus e Penalidade dentro dos limites
    bonusPoints = Math.min(bonusPoints, maxBonus);
    penaltyPoints = Math.max(penaltyPoints, maxPenalty);
    score += bonusPoints + penaltyPoints;

    // Garante que a nota final fique entre 10 e 100
    score = Math.max(minScore, Math.min(score, 100));

    return {
        report,
        score
    };
}

module.exports = validateHTML;