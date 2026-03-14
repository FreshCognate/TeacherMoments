import createSlideResponsesSummary from './services/createSlideResponsesSummary.js';
import createScenarioResponsesSummary from './services/createScenarioResponsesSummary.js';

export default {

  create: async function ({ body }, context) {
    if (body.slideRef) {
      return await createSlideResponsesSummary(body, context);
    }
    return await createScenarioResponsesSummary(body, context);
  }

};
