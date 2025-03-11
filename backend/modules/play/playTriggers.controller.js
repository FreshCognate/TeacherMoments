import getPublishedTriggersByScenarioId from "../triggers/services/getPublishedTriggersByScenarioId.js";

export default {

  all: async function ({ query, body }, context) {

    const { scenario } = query;

    return await getPublishedTriggersByScenarioId({ scenarioId: scenario }, {}, context);

  },

};