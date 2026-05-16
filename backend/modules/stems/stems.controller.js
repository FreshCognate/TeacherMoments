import getStemsByScenarioId from './services/getStemsByScenarioId.js';
import getStemById from './services/getStemById.js';
import createStem from './services/createStem.js';
import updateStemById from './services/updateStemById.js';
import deleteStemById from './services/deleteStemById.js';

export default {
  all: async function ({ query }, context) {

    const { scenarioId, isDeleted } = query;

    return await getStemsByScenarioId({ scenarioId }, { isDeleted }, context);

  },

  create: async function ({ body }, context) {

    const { scenarioId, slideRef, sortOrder } = body;

    const newStem = await createStem({ scenario: scenarioId, slideRef, sortOrder }, {}, context);

    return { stem: newStem };

  },

  read: async function ({ param }, context) {

    const stem = await getStemById({ stemId: param }, {}, context);

    return { stem };

  },

  update: async function ({ param, body }, context) {

    const stem = await updateStemById({ stemId: param, update: body }, {}, context);

    return { stem };

  },

  delete: async function ({ param }, context) {

    const stem = await deleteStemById({ stemId: param }, {}, context);

    return { stem };

  }
};
