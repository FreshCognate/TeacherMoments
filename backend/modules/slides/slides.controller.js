import getSlides from './services/getSlides.js';
import getSlidesByScenarioId from './services/getSlidesByScenarioId.js';
import getSlideById from './services/getSlideById.js';
import restoreSlideById from './services/restoreSlideById.js';
import updateSlideById from './services/updateSlideById.js';
import deleteSlideById from './services/deleteSlideById.js';
import createSlide from './services/createSlide.js';
import moveSlideInScenario from './services/moveSlideInScenario.js';
import duplicateSlideInScenario from './services/duplicateSlideInScenario.js';
import lockSlide from './services/lockSlide.js';
import unlockSlide from './services/unlockSlide.js';
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

    const { scenarioId, parentId, slideId, sortOrder } = body;

    let slide;

    if (slideId) {
      slide = await duplicateSlideInScenario({ scenario: scenarioId, parentId, slideId, sortOrder }, context);
    } else {
      slide = await createSlide({ scenario: scenarioId, parentId, sortOrder }, {}, context);
    }

    return { slide };

  },
  read: async function ({ param }, context) {

    const slide = await getSlideById({ slideId: param }, {}, context);
    return { slide };

  },

  update: async function ({ param, body }, context) {

    if (has(body, 'sortOrder')) {
      const { scenarioId, parentId, sortOrder } = body;
      const slide = await moveSlideInScenario({ scenario: scenarioId, parentId, slideId: param, sortOrder }, context);
      return { slide };
    }

    if (has(body, 'isDeleted')) {
      const slide = await restoreSlideById({ slideId: param }, {}, context);
      return { slide };
    }

    if (has(body, 'isLocked')) {
      let slide;
      if (body.isLocked) {
        slide = await lockSlide({ slideId: param }, {}, context);
        return { slide };
      } else {
        slide = await unlockSlide({ slideId: param }, {}, context);
      }
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