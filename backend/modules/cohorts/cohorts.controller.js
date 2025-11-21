import getCohorts from './services/getCohorts.js';
import getCohortById from './services/getCohortById.js';
import restoreCohortById from './services/restoreCohortById.js';
import updateCohortById from './services/updateCohortById.js';
import deleteCohortById from './services/deleteCohortById.js';
import createCohort from './services/createCohort.js';
import duplicateCohort from './services/duplicateCohort.js';
import archiveCohortById from './services/archiveCohortById.js';
import unarchiveCohortById from './services/unarchiveCohortById.js';
import has from 'lodash/has.js';

export default {

  all: async function ({ query }, context) {

    const { searchValue, currentPage, sortBy, accessType, isArchived, isDeleted } = query;

    return await getCohorts({ accessType }, { searchValue, currentPage, sortBy, isArchived, isDeleted }, context);

  },

  create: async function ({ body }, context) {

    const { name, cohortId } = body;

    let cohort;

    if (cohortId) {
      cohort = await duplicateCohort({ cohortId }, {}, context);
    } else {
      cohort = await createCohort({ name }, {}, context);
    }

    return { cohort }

  },

  read: async function ({ param }, context) {

    const cohort = await getCohortById({ cohortId: param }, {}, context);
    return { cohort };

  },

  update: async function ({ param, body }, context) {

    if (has(body, 'isDeleted')) {
      const cohort = await restoreCohortById({ cohortId: param }, {}, context);
      return { cohort };
    }

    if (has(body, 'isArchived')) {
      let cohort;
      if (body.isArchived) {
        cohort = await archiveCohortById({ cohortId: param }, {}, context);
      } else {
        cohort = await unarchiveCohortById({ cohortId: param }, {}, context);
      }
      return { cohort };
    }

    const cohort = await updateCohortById({ cohortId: param, update: body }, {}, context);

    return { cohort };

  },

  delete: async function ({ param }, context) {
    const cohort = await deleteCohortById({ cohortId: param }, {}, context);

    return { cohort };
  }

};