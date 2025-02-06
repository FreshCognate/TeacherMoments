import getSlides from './services/getSlides.js';
import getSlidesByScenarioId from './services/getSlidesByScenarioId.js';
import getSlideById from './services/getSlideById.js';
import restoreSlideById from './services/restoreSlideById.js';
import updateSlideById from './services/updateSlideById.js';
import deleteSlideById from './services/deleteSlideById.js';
import createSlide from './services/createSlide.js';
import reorderSlide from './services/reorderSlide.js';
import duplicateSlideInScenario from './services/duplicateSlideInScenario.js';
import lockSlide from './services/lockSlide.js';
import has from 'lodash/has.js';

export default {
  all: async function ({ query }, context) {

    const { searchValue, currentPage, scenarioId, isDeleted } = query;

    if (scenarioId) {
      return await getSlidesByScenarioId({ scenarioId }, { isDeleted }, context);
    }

    return await getSlides({}, { searchValue, currentPage, isDeleted }, context);

  },

  create: async function ({ body }, context) {

    const { name, scenarioId, parentId, slideId, sortOrder } = body;

    let slide;

    if (slideId) {
      slide = await duplicateSlideInScenario({ scenario: scenarioId, parentId, slideId, sortOrder }, context);
    } else {
      slide = await createSlide({ name, scenario: scenarioId, parentId }, {}, context);
    }

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

    if (has(body, 'isLocked')) {
      const slide = await lockSlide({ slideId: param }, {}, context);
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