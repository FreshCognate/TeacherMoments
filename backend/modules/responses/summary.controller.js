import createBlockResponsesSummary from './services/createBlockResponsesSummary.js';
import createScenarioResponsesSummary from './services/createScenarioResponsesSummary.js';

export default {

  create: async function ({ body }, context) {
    if (body.blockRef) {
      return await createBlockResponsesSummary(body, context);
    }
    return await createScenarioResponsesSummary(body, context);
  }

};
