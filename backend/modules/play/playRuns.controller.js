import getUsersRunByScenarioId from '../runs/services/getUsersRunByScenarioId.js';
import updateUsersRunByScenarioId from '../runs/services/updateUsersRunByScenarioId.js';

export default {

  read: async function ({ param, body }, context) {

    let run = await getUsersRunByScenarioId({ scenarioId: param }, {}, context);

    return { run }

  },

  update: async function ({ param, body }, context) {
    let run = await updateUsersRunByScenarioId({ scenarioId: param, update: body }, {}, context);

    return { run }
  }

};