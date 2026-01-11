import getUsersResponsesByCohortAndScenario from "./services/getUsersResponsesByCohortAndScenario.js";

export default {

  all: async function ({ query, body }, context) {

    const { cohortId, scenarioId } = query;

    console.log(query);

    if (cohortId && scenarioId) {
      return await getUsersResponsesByCohortAndScenario({ cohortId, scenarioId }, {}, context);
    }

    return {
      responses: []
    }

  },

};