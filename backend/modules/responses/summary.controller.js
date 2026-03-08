import createBlockResponsesSummary from './services/createBlockResponsesSummary.js';

export default {

  create: async function ({ body }, context) {
    return await createBlockResponsesSummary(body, context);
  }

};
