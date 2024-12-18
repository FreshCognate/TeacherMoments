import has from 'lodash/has.js';
import createTrigger from './services/createTrigger.js';
import getTriggerById from './services/getTriggerById.js';
import deleteTriggerById from './services/deleteTriggerById.js';
import updateTriggerById from './services/updateTriggerById.js';
import restoreTriggerById from './services/restoreTriggerById.js';
import getTriggersByScenarioId from './services/getTriggersByScenarioId.js';

export default {

  all: async function ({ query }, context) {
    const { scenario, isDeleted } = query;

    return await getTriggersByScenarioId({ scenarioId: scenario }, { isDeleted }, context);

  },

  create: async function ({ body }, context) {
    const { scenario, triggerType, elementRef, event } = body;

    const trigger = await createTrigger({ scenario, triggerType, elementRef, event }, {}, context);

    return { trigger };
  },

  read: async function ({ param }, context) {
    const trigger = await getTriggerById({ triggerId: param }, {}, context);
    return { trigger };
  },

  update: async function ({ param, body }, context) {
    if (has(body, 'isDeleted')) {
      const trigger = await restoreTriggerById({ triggerId: param }, {}, context);
      return { trigger };
    }

    const trigger = await updateTriggerById({ triggerId: param, update: body }, {}, context);

    return { trigger };
  },

  delete: async function ({ param }, context) {
    const trigger = await deleteTriggerById({ triggerId: param }, {}, context);

    return { trigger };
  }

};