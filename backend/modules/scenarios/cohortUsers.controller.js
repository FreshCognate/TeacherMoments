import getUsersByCohortId from '#core/users/services/getUsersByCohortId.js';

export default {
  all: async function ({ query }, context) {

    const { cohortId, searchValue, currentPage } = query;

    return await getUsersByCohortId({ cohortId }, { searchValue, currentPage }, context);

  }
};