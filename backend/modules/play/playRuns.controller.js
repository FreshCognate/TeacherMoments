import getUsersRunByScenarioId from '../runs/services/getUsersRunByScenarioId.js';
import getUsersRunsByCohortId from '../runs/services/getUsersRunsByCohortId.js';
import updateUsersRunByScenarioId from '../runs/services/updateUsersRunByScenarioId.js';

export default {

  all: async function ({ query }, context) {

    return await getUsersRunsByCohortId({ cohortId: query.cohort }, {}, context);

  },

  read: async function ({ param, query }, context) {

    let run = await getUsersRunByScenarioId({ scenarioId: param, cohortId: query.cohort }, {}, context);

    return { run }

  },

  update: async function ({ param, body }, context) {
    let run = await updateUsersRunByScenarioId({ scenarioId: param, update: body }, {}, context);

    return { run }
  }

};