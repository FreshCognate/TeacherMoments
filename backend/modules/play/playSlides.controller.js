import getPublishedSlidesByScenario from "../slides/services/getPublishedSlidesByScenario.js";

export default {

  all: async function ({ query, body }, context) {

    const { scenario } = query;
    let slides = await getPublishedSlidesByScenario({ scenarioId: scenario }, {}, context);

    return { slides }

  },

};