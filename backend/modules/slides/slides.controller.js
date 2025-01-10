import getSlides from './services/getSlides.js';
import getSlidesByScenarioId from './services/getSlidesByScenarioId.js';
import getSlideById from './services/getSlideById.js';
import restoreSlideById from './services/restoreSlideById.js';
import updateSlideById from './services/updateSlideById.js';
import deleteSlideById from './services/deleteSlideById.js';
import createSlide from './services/createSlide.js';
import reorderSlide from './services/reorderSlide.js';
import has from 'lodash/has.js';

export default {
  all: async function ({ query }, context) {

    const { searchValue, currentPage, scenario, isDeleted } = query;

    if (scenario) {
      return await getSlidesByScenarioId({ scenarioId: scenario }, { isDeleted }, context);
    }

    return await getSlides({}, { searchValue, currentPage, isDeleted }, context);

  },

  create: async function ({ body }, context) {

    const { name, scenario, parent } = body;

    const slide = await createSlide({ name, scenario, parent }, {}, context);

    return { slide };

  },
  read: async function ({ param }, context) {

    const slide = await getSlideById({ slideId: param }, {}, context);
    return { slide };

  },

  update: async function ({ param, body }, context) {

    if (has(body, 'isDeleted')) {
      const slide = await restoreSlideById({ slideId: param }, {}, context);
      return { slide };
    }

    if (has(body, 'sourceIndex') || has(body, 'destinationIndex')) {
      const { sourceIndex, destinationIndex } = body;
      const slide = await reorderSlide({ sourceIndex, destinationIndex, slideId: param }, {}, context);
      return { slide };
    }

    const slide = await updateSlideById({ slideId: param, update: body }, {}, context);

    return { slide };

  },
  delete: async function ({ param }, context) {
    const slide = await deleteSlideById({ slideId: param }, {}, context);

    return { slide };
  }
};