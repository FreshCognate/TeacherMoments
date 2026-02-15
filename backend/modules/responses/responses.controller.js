import getUsersResponsesByCohortAndScenario from "./services/getUsersResponsesByCohortAndScenario.js";
import getUsersResponsesByScenario from "./services/getUsersResponsesByScenario.js";

export default {

  all: async function ({ query, body }, context) {

    const { cohortId, scenarioId } = query;

    if (cohortId && scenarioId) {
      return await getUsersResponsesByCohortAndScenario({ cohortId, scenarioId }, {}, context);
    }

    if (scenarioId) {
      return await getUsersResponsesByScenario({ scenarioId }, {}, context);
    }

    return {
      responses: []
    }

  },

};