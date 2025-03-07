const { validateGitRepo } = require('./validator');

describe("Validação de Histórico Git", () => {
    const result = validateGitRepo();
    test("Verifica conformidade do repositório Git", () => {

        console.log("Resultados Git:", result);

        expect(result.failed.length).toBe(0);
    });

    test ("Verifica se a quantidade de commits é maior que 1", () => {
        expect(result.passed).toContain("Quantidade de commits (9) dentro do esperado.");
    });

    test ("Verifica se a quantidade de merges é maior que 1", () => {
        expect(result.failed).toContain("Quantidade de merges (0) abaixo do mínimo esperado (1).");
    });
});
