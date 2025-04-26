import addCollaboratorsToScenario from './services/addCollaboratorsToScenario.js';
import removeCollaboratorsFromScenario from './services/removeCollaboratorsFromScenario.js';
import getAvailableCollaboratorsByScenarioId from './services/getAvailableCollaboratorsByScenarioId.js';
import has from 'lodash/has.js';

export default {
  all: async function ({ query }, context) {

    const { searchValue, currentPage, scenarioId, isDeleted } = query;

    return await getAvailableCollaboratorsByScenarioId({ scenarioId }, { searchValue, currentPage, isDeleted }, context);

  },

  update: async function ({ param, body }, context) {


    const { setType, collaborators } = body;

    if (setType === 'ADD') {
      return await addCollaboratorsToScenario({ scenarioId: param, collaborators }, {}, context);
    }

    if (setType === 'REMOVE') {
      return await removeCollaboratorsFromScenario({ scenarioId: param, collaborators }, {}, context);
    }
    return {};
  },
};