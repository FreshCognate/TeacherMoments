import getUsersTrackingByScenarioId from '../trackings/services/getUsersTrackingByScenarioId.js';

export default {

  read: async function ({ param, body }, context) {

    let tracking = await getUsersTrackingByScenarioId({ scenarioId: param }, {}, context);

    return { tracking }

  },

};