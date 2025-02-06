function validateCSS(css, rules) {
    let results = { passed: [], failed: [] };

    rules.requiredSelectors.forEach(selector => {
        if (css.includes(selector)) results.passed.push(`Seletor ${selector} encontrado.`);
        else results.failed.push(`Seletor ${selector} não encontrado.`);
    });

    rules.forbiddenProperties.forEach(property => {
        if (css.includes(property)) results.failed.push(`Propriedade proibida ${property} encontrada.`);
        else results.passed.push(`Propriedade proibida ${property} não encontrada.`);
    });

    return results;
}

module.exports = validateCSS;