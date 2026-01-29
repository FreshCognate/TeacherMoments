import getPublishedScenariosByCohortId from './services/getPublishedScenariosByCohortId.js';
import sortCohortScenarios from './services/sortCohortScenarios.js';

export default {
  all: async function ({ query }, context) {

    const { user } = context;

    const { cohortId, searchValue, currentPage } = query;

    return await getPublishedScenariosByCohortId({ cohortId }, {}, context);

  },

  create: async function ({ body }, context) {

    const { cohortId, scenarios } = body;

    return await sortCohortScenarios({ cohortId, scenarios }, {}, context);

  },
};