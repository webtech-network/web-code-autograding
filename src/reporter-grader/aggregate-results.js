const { COLORS } = require("./colors");
const Table = require("cli-table3");
const { getTotalMaxScore, getTestWeight, getTestScore, totalPercentageReducer, getMaxScoreForTest } = require("./helpers/test-helpers");

function getTableTotals(runnerResults, pushToTable) {
  const totalMaxScore = getTotalMaxScore(runnerResults);

  return runnerResults.map(({ runner, results }) => {
    const maxScore = getMaxScoreForTest(results);
    //TODO: rever a questão do peso para testes unitarios
    //const weight = getTestWeight(maxScore, totalMaxScore);
    const weight = results.weight;
    const score = getTestScore(results);
    const testName = runner.trim();

    pushToTable([testName, weight, score, maxScore]);

    return {
      score,
      weight,
      maxScore,
    };
  });
}

function AggregateResults(runnerResults) {
  try {
    const table = new Table({
      head: ["Teste realizado", "Peso", "Nota", "Valor Max"],
      colWidths: [20, 13, 13, 13],
    });

    const totals = getTableTotals(runnerResults, (row) => table.push(row));

    // const totalPercent = totals.reduce(totalPercentageReducer, 0).toFixed(2) + "%";
    const totalTestScores = totals.reduce((acc, curr) => acc + curr.score * (curr.weight/100), 0)
    const totalMaxScores = totals.reduce((acc, curr) => acc + curr.maxScore * (curr.weight/100), 0)

    table.push(['Total: ', '--', `${totalTestScores}`, `${totalMaxScores}`]);
    
    console.log(table.toString());
  } catch (error) {
    throw new Error(error.message);
  }
}

exports.AggregateResults = AggregateResults;
exports.getTableTotals = getTableTotals;
