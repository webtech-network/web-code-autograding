function validateCSS(css, rules) {
    let results = { passed: [], failed: [] };

    // remove todo o conteúdo de comentários do css
    css = css.replace(/\/\*.*?\*\//g, '');

    // realiza uma busca no css, utilizando regex para extrair seletores em um array e propriedades em outro
    const selectors = css.match(/[^{]+(?=\{)/g) || [];
    const properties = css.match(/[^:]+(?=;)/g) || [];
    console.log ("seletores: ", selectors);
    console.log ("props: ", properties); 


    rules.requiredSelectors.forEach(selector => {
        if (selectors.includes(selector)) results.passed.push(`Seletor ${selector} encontrado.`);
        else results.failed.push(`Seletor ${selector} não encontrado.`);
    });

    rules.requiredProperties.forEach(property => {
        if (css.includes(property)) results.passed.push(`Propriedade ${property} encontrada.`);
        else results.failed.push(`Propriedade ${property} não encontrada.`);
    });

    rules.forbiddenProperties.forEach(property => {
        if (css.includes(property)) results.failed.push(`Propriedade proibida ${property} encontrada.`);
        else results.passed.push(`Propriedade proibida ${property} não encontrada.`);
    });

    return results;
}

module.exports = validateCSS;