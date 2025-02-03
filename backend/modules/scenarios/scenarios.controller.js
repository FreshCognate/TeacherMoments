import getScenarios from './services/getScenarios.js';
import getScenarioById from './services/getScenarioById.js';
import restoreScenarioById from './services/restoreScenarioById.js';
import updateScenarioById from './services/updateScenarioById.js';
import deleteScenarioById from './services/deleteScenarioById.js';
import createScenario from './services/createScenario.js';
import has from 'lodash/has.js';

export default {
  all: async function ({ query }, context) {

    const { searchValue, currentPage, sortBy, accessType, isDeleted } = query;

    return await getScenarios({ accessType }, { searchValue, currentPage, sortBy, isDeleted }, context);

  },

  create: async function ({ body }, context) {

    const { name, accessType } = body;

    const scenario = await createScenario({ name, accessType }, {}, context);

    return { scenario }

  },
  read: async function ({ param }, context) {

    const scenario = await getScenarioById({ scenarioId: param }, {}, context);
    return { scenario };

  },

  update: async function ({ param, body }, context) {

    if (has(body, 'isDeleted')) {
      const scenario = await restoreScenarioById({ scenarioId: param }, {}, context);
      return { scenario };
    }

    const scenario = await updateScenarioById({ scenarioId: param, update: body }, {}, context);

    return { scenario };

  },
  delete: async function ({ param }, context) {
    const scenario = await deleteScenarioById({ scenarioId: param }, {}, context);

    return { scenario };
  }
};