import getUsersResponsesByCohortAndScenario from "./services/getUsersResponsesByCohortAndScenario.js";
import getUsersResponsesByScenario from "./services/getUsersResponsesByScenario.js";
import getUserResponsesByCohortScenarios from "./services/getUserResponsesByCohortScenarios.js";

export default {

  all: async function ({ query, body }, context) {

    const { cohortId, scenarioId, userId, searchValue, currentPage } = query;

    if (userId && cohortId) {
      return await getUserResponsesByCohortScenarios({ userId, cohortId }, { searchValue, currentPage }, context);
    }

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