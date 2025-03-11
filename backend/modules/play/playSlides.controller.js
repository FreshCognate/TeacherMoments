import getPublishedSlidesByScenarioId from "../slides/services/getPublishedSlidesByScenarioId.js";

export default {

  all: async function ({ query, body }, context) {

    const { scenario } = query;

    return await getPublishedSlidesByScenarioId({ scenarioId: scenario }, {}, context);

  },

};