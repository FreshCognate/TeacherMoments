import getScenariosByCohortId from './services/getScenariosByCohortId.js';
import sortCohortScenarios from './services/sortCohortScenarios.js';

export default {
  all: async function ({ query }, context) {

    const { cohortId, searchValue, currentPage } = query;

    return await getScenariosByCohortId({ cohortId }, { searchValue, currentPage }, context);

  },

  create: async function ({ body }, context) {

    const { cohortId, scenarios } = body;

    return await sortCohortScenarios({ cohortId, scenarios }, {}, context);

  },
};