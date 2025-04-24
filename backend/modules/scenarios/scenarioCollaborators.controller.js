import getAvailableCollaboratorsByScenarioId from './services/getAvailableCollaboratorsByScenarioId.js';
import has from 'lodash/has.js';

export default {
  all: async function ({ query }, context) {

    const { searchValue, currentPage, scenarioId, isDeleted } = query;

    return await getAvailableCollaboratorsByScenarioId({ scenarioId }, { searchValue, currentPage, isDeleted }, context);

  },

  // update: async function ({ param, body }, context) {

  //   if (has(body, 'isDeleted')) {
  //     const scenario = await restoreScenarioById({ scenarioId: param }, {}, context);
  //     return { scenario };
  //   }

  //   const scenario = await updateScenarioById({ scenarioId: param, update: body }, {}, context);

  //   return { scenario };

  // },
};