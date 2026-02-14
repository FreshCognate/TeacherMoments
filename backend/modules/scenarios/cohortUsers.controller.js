import getUsersByCohortId from '#core/users/services/getUsersByCohortId.js';
import removeUserFromCohort from '../cohorts/services/removeUserFromCohort.js';

export default {
  all: async function ({ query }, context) {

    const { cohortId, searchValue, currentPage } = query;

    return await getUsersByCohortId({ cohortId }, { searchValue, currentPage }, context);

  },

  delete: async function ({ param, query }, context) {

    const { cohortId } = query;

    return await removeUserFromCohort({ userId: param, cohortId }, {}, context);

  }
};