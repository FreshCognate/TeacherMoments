import addUserToCohort from '../cohorts/services/addUserToCohort.js';
import checkInviteIdIsValid from './services/checkInviteIdIsValid.js';

export default {

  create: async function ({ body }, context) {

    const { inviteId } = body;

    if (inviteId) {
      const cohort = await checkInviteIdIsValid({ inviteId }, {}, context);
      if (cohort) {
        await addUserToCohort({ cohortId: cohort._id }, {}, context);
        return cohort;
      }
    }

    return {}

  }

};