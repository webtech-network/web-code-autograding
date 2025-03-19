const { validateGITRepo } = require('.');

describe("Validação de Histórico Git", () => {
    const result = validateGITRepo();
    test("Verifica conformidade do repositório Git", () => {

        console.log("Resultados Git:", result);

        expect(result.failed.length).toBe(0);
    });
});
