import checkHasAccessToScenario from '../helpers/checkHasAccessToScenario.js';
import setScenarioHasChanges from './setScenarioHasChanges.js';
import map from 'lodash/map.js';
import includes from 'lodash/includes.js';

export default async (props, options, context) => {

  const { scenarioId, collaborators } = props;
  const { models } = context;

  await checkHasAccessToScenario({ modelId: scenarioId, modelType: 'Scenario' }, context);

  const scenario = await models.Scenario.findById(scenarioId);
  if (!scenario) throw { message: 'This scenario does not exist', statusCode: 404 };

  const uniqueCollaboratorsToAdd = [];

  const existingCollaborators = map(scenario.collaborators, (collaborator) => {
    return String(collaborator.user);
  });

  for (const collaborator of collaborators) {
    if (!includes(existingCollaborators, collaborator)) {
      uniqueCollaboratorsToAdd.push({
        role: 'AUTHOR',
        user: collaborator
      })
    }
  }

  await models.Scenario.findByIdAndUpdate(scenarioId, {
    $push: { collaborators: uniqueCollaboratorsToAdd }
  });

  await setScenarioHasChanges({ scenarioId }, {}, context);

  return {};

};