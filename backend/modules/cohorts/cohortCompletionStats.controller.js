import getCohortCompletionStatsByCohortId from './services/getCohortCompletionStatsByCohortId.js';

export default {
  all: async function ({ query }, context) {
    const { cohortId } = query;
    return await getCohortCompletionStatsByCohortId({ cohortId }, {}, context);
  },
};
