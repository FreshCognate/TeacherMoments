import createSlideResponsesSummary from './services/createSlideResponsesSummary.js';
import createScenarioResponsesSummary from './services/createScenarioResponsesSummary.js';
import createUserResponsesSummary from './services/createUserResponsesSummary.js';

export default {

  create: async function ({ body }, context) {
    if (body.userId) {
      return await createUserResponsesSummary(body, context);
    }
    if (body.slideRef) {
      return await createSlideResponsesSummary(body, context);
    }
    return await createScenarioResponsesSummary(body, context);
  }

};
