const { validateGitRepo } = require('.');

describe("Validação de Histórico Git", () => {
    const result = validateGitRepo();
    test("Verifica conformidade do repositório Git", () => {

        console.log("Resultados Git:", result);

        expect(result.failed.length).toBe(0);
    });
});
