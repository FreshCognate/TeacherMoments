import getBlocks from './services/getBlocks.js';
import getBlocksByScenarioIdAndSlideRef from './services/getBlocksByScenarioIdAndSlideRef.js';
import getBlocksByScenarioId from './services/getBlocksByScenarioId.js';
import getBlockById from './services/getBlockById.js';
import restoreBlockById from './services/restoreBlockById.js';
import updateBlockById from './services/updateBlockById.js';
import deleteBlockById from './services/deleteBlockById.js';
import createBlock from './services/createBlock.js';
import reorderBlock from './services/reorderBlock.js';
import has from 'lodash/has.js';

export default {
  all: async function ({ query }, context) {

    const { searchValue, currentPage, scenarioId, slideRef, isDeleted } = query;

    if (scenarioId) {
      if (slideRef) {
        return await getBlocksByScenarioIdAndSlideRef({ scenarioId, slideRef }, { isDeleted }, context);
      } else {
        return await getBlocksByScenarioId({ scenarioId }, { isDeleted }, context);
      }
    }

    return await getBlocks({}, { searchValue, currentPage, isDeleted }, context);

  },

  create: async function ({ body }, context) {

    const { scenarioId, slideRef, blockType } = body;

    const block = await createBlock({ scenario: scenarioId, slideRef, blockType }, {}, context);

    return { block };

  },
  read: async function ({ param }, context) {

    const block = await getBlockById({ blockId: param }, {}, context);
    return { block };

  },

  update: async function ({ param, body }, context) {

    if (has(body, 'isDeleted')) {
      const block = await restoreBlockById({ blockId: param }, {}, context);
      return { block };
    }

    if (has(body, 'sourceIndex') || has(body, 'destinationIndex')) {
      const { sourceIndex, destinationIndex } = body;
      const block = await reorderBlock({ sourceIndex, destinationIndex, blockId: param }, {}, context);
      return { block };
    }

    const block = await updateBlockById({ blockId: param, update: body }, {}, context);

    return { block };

  },
  delete: async function ({ param }, context) {
    const block = await deleteBlockById({ blockId: param }, {}, context);

    return { block };
  }
};