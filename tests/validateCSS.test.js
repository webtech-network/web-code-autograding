const { validateCSSFile } = require('./validator');

describe("Validação de CSS", () => {
    test("Verifica conformidade do CSS", () => {
        const result = validateCSSFile();

        console.log("Resultados CSS:", result);

        expect(result.score).toBeGreaterThanOrEqual(60);
    });
});