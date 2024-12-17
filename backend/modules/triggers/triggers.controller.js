import has from 'lodash/has.js';
import createTrigger from './services/createTrigger.js';
import getTriggerById from './services/getTriggerById.js';

export default {

  all: async function ({ query }, context) {

  },

  create: async function ({ body }, context) {
    const { scenario, triggerType, elementRef } = body;

    const trigger = await createTrigger({ scenario, triggerType, elementRef }, {}, context);

    return { trigger };
  },

  read: async function ({ param }, context) {
    const trigger = await getTriggerById({ triggerId: param }, {}, context);
    return { trigger };
  },

  update: async function ({ param, body }, context) {

  },

  delete: async function ({ param }, context) {

  }

};