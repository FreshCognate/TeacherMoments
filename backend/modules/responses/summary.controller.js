import getBlockResponsesSummary from './services/getBlockResponsesSummary.js';

export default {

  all: async function ({ query }, context) {
    return await getBlockResponsesSummary(query, context);
  }

};
