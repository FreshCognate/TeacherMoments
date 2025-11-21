import getAvailableScenariosByCohortId from './services/getAvailableScenariosByCohortId.js';

export default {
  all: async function ({ query }, context) {

    const { cohortId, searchValue, currentPage } = query;

    return await getAvailableScenariosByCohortId({ cohortId }, { searchValue, currentPage }, context);

  },
};