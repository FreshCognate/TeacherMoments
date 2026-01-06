import getPublishedScenariosByCohortId from './services/getPublishedScenariosByCohortId.js';
import getScenariosByCohortId from './services/getScenariosByCohortId.js';
import sortCohortScenarios from './services/sortCohortScenarios.js';

export default {
  all: async function ({ query }, context) {

    const { user } = context;

    const { cohortId, searchValue, currentPage } = query;

    if (user.role === 'PARTICIPANT') {
      return await getPublishedScenariosByCohortId({ cohortId }, {}, context);
    }

    return await getScenariosByCohortId({ cohortId }, { searchValue, currentPage }, context);

  },

  create: async function ({ body }, context) {

    const { cohortId, scenarios } = body;

    return await sortCohortScenarios({ cohortId, scenarios }, {}, context);

  },
};