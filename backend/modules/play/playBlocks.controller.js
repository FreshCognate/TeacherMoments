import getPublishedBlocksByScenarioId from "../blocks/services/getPublishedBlocksByScenarioId.js";

export default {

  all: async function ({ query, body }, context) {

    const { scenario } = query;

    return await getPublishedBlocksByScenarioId({ scenarioId: scenario }, {}, context);

  },

};