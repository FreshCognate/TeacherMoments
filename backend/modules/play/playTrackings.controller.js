import getUsersTrackingByScenarioId from '../trackings/services/getUsersTrackingByScenarioId.js';
import updateUsersTrackingByScenarioId from '../trackings/services/updateUsersTrackingByScenarioId.js';

export default {

  read: async function ({ param, body }, context) {

    let tracking = await getUsersTrackingByScenarioId({ scenarioId: param }, {}, context);

    return { tracking }

  },

  update: async function ({ param, body }, context) {
    let tracking = await updateUsersTrackingByScenarioId({ scenarioId: param, update: body }, {}, context);

    return { tracking }
  }

};