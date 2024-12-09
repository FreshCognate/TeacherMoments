import getBlocks from './services/getBlocks.js';
import getBlocksByScenarioIdAndSlideId from './services/getBlocksByScenarioIdAndSlideId.js';
import getBlocksBySlideId from './services/getBlocksBySlideId.js';
import getBlockById from './services/getBlockById.js';
import restoreBlockById from './services/restoreBlockById.js';
import updateBlockById from './services/updateBlockById.js';
import deleteBlockById from './services/deleteBlockById.js';
import createBlock from './services/createBlock.js';
import reorderBlock from './services/reorderBlock.js';
import has from 'lodash/has.js';

export default {
  all: async function ({ query }, context) {

    const { searchValue, currentPage, scenario, slide, isDeleted } = query;

    if (scenario) {
      if (slide) {
        return await getBlocksByScenarioIdAndSlideId({ scenarioId: scenario, slideId: slide }, { isDeleted }, context);
      } else {
        return await getBlocksBySlideId({ scenarioId: scenario }, { isDeleted }, context);
      }
    }

    return await getBlocks({}, { searchValue, currentPage, isDeleted }, context);

  },

  create: async function ({ body }, context) {

    const { scenario, slide, blockType } = body;

    const block = await createBlock({ scenario, slide, blockType }, {}, context);

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