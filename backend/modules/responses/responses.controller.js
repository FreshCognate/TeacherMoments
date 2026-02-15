import getUsersResponsesByCohortAndScenario from "./services/getUsersResponsesByCohortAndScenario.js";
import getUsersResponsesByScenario from "./services/getUsersResponsesByScenario.js";

export default {

  all: async function ({ query, body }, context) {

    const { cohortId, scenarioId, searchValue, currentPage } = query;

    if (cohortId && scenarioId) {
      return await getUsersResponsesByCohortAndScenario({ cohortId, scenarioId }, { searchValue, currentPage }, context);
    }

    if (scenarioId) {
      return await getUsersResponsesByScenario({ scenarioId }, { searchValue, currentPage }, context);
    }

    return {
      responses: []
    }

  },

};