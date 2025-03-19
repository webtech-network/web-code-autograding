const { validateCSSFile } = require('.');

describe("Validação de CSS", () => {
    test("Verifica conformidade do CSS", () => {
        const result = validateCSSFile();

        console.log("Resultados CSS:", result);

        // faça um teste simulado qualquer
        expect('a').toBe('a');
        expect('a').toBe('b');
        expect(result.score).toBeGreaterThanOrEqual(60);

    });
});