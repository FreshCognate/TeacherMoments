import getScenarioByPublishLink from '../scenarios/services/getScenarioByPublishLink.js';

export default {

  read: async function ({ param, body }, context) {

    let scenario = await getScenarioByPublishLink({ publishLink: param }, {}, context);

    return { scenario }

  },

};