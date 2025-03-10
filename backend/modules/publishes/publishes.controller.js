import publishScenarioById from './services/publishScenarioById.js';

export default {

  create: async function ({ body }, context) {

    const { scenarioId } = body;

    let scenario = await publishScenarioById({ scenarioId }, {}, context);

    return { scenario }

  }

};