const getMaxScoreForTest = (runnerResult) => runnerResult.max_score || 0;

const getTotalMaxScore = (runnerResults) => {
  return runnerResults.reduce((acc, { results }) => acc + results.max_score, 0);
};

const totalPercentageReducer = (acc, { score, weight, maxScore }) => {
  return acc + ((score || 0) / (maxScore || 1)) * weight;
};

const getTestScore = (runnerResult) => {
  const { tests } = runnerResult;
  const score = runnerResult.tests.reduce((acc, { status, score }) => {
    return status === "pass" ? acc + score : acc;
  }, 0);

  return score
  //TODO: verificar cálculo de score para o caso de testes unitários 
  // cujo valor era calculado como 1 ou 0
  return (score / tests.length) * (getMaxScoreForTest(runnerResult) || 0);
};

const getTestWeight = (maxScore, allMaxScores) => {
  if (maxScore === 0) {
    return (0).toFixed(1);
  }
  const weight = allMaxScores !== 0 ? (maxScore / allMaxScores) * 100 : 0;

  return Math.round(weight).toFixed(2);
};

exports.getMaxScoreForTest = getMaxScoreForTest;
exports.getTotalMaxScore = getTotalMaxScore;
exports.totalPercentageReducer = totalPercentageReducer;
exports.getTestScore = getTestScore;
exports.getTestWeight = getTestWeight;
