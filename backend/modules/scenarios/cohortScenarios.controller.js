import getScenariosByCohortId from './services/getScenariosByCohortId.js';

export default {
  all: async function ({ query }, context) {

    const { cohortId, searchValue, currentPage } = query;

    return await getScenariosByCohortId({ cohortId }, { searchValue, currentPage }, context);

  },
};