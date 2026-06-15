import getPublishedStemsByScenarioId from "../stems/services/getPublishedStemsByScenarioId.js";

export default {

  all: async function ({ query, body }, context) {

    const { scenario } = query;

    return await getPublishedStemsByScenarioId({ scenarioId: scenario }, {}, context);

  },

};
