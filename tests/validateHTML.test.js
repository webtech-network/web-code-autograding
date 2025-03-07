const { validateHTMLFile } = require('./validator');

describe("Verificação HTML", () => {
    test("Boas práticas HTML >= 60%", () => {
        const result = validateHTMLFile();

        console.log("Resultados HTML:", result);

        expect(result.score).toBeGreaterThanOrEqual(60);
    });
});