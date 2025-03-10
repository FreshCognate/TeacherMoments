import publishScenarioById from './services/publishScenarioById.js';
import unpublishScenarioById from './services/unpublishScenarioById.js';

export default {

  create: async function ({ body }, context) {

    const { scenarioId } = body;

    let scenario = await publishScenarioById({ scenarioId }, {}, context);

    return { scenario }

  },

  delete: async function ({ param }, context) {
    const scenario = await unpublishScenarioById({ scenarioId: param }, {}, context);

    return { scenario };
  }

};