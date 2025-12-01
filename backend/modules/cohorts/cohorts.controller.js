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
import addScenarioToCohort from './services/addScenarioToCohort.js';
import removeScenarioFromCohort from './services/removeScenarioFromCohort.js';
import generateCohortInvite from './services/generateCohortInvite.js';

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

    if (body.intent === 'CREATE_INVITE') {
      const cohort = await generateCohortInvite({ cohortId: param }, {}, context);
      return { cohort };
    }

    if (has(body, 'scenarioId')) {
      if (body.intent === 'ADD') {
        const cohort = await addScenarioToCohort({ cohortId: param, update: body }, {}, context);
        return { cohort };
      } else if (body.intent === 'REMOVE') {
        const cohort = await removeScenarioFromCohort({ cohortId: param, update: body }, {}, context);
        return { cohort };
      }
    }

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