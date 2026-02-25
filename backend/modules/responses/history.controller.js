import getUserResponsesByUserScenarios from './services/getUserResponsesByUserScenarios.js';

export default {

  all: async function ({ query }, context) {
    const { searchValue, currentPage } = query;
    return await getUserResponsesByUserScenarios({}, { searchValue, currentPage }, context);
  },

};
