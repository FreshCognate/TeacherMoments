import checkHasAccessToScenario from '../helpers/checkHasAccessToScenario.js';
import setScenarioHasChanges from './setScenarioHasChanges.js';

export default async (props, options, context) => {

  const { scenarioId, collaborators } = props;
  const { models, user } = context;

  await checkHasAccessToScenario({ modelId: scenarioId, modelType: 'Scenario' }, context);

  const scenario = await models.Scenario.findById(scenarioId);
  if (!scenario) throw { message: 'This scenario does not exist', statusCode: 404 };

  await models.Scenario.findByIdAndUpdate(scenarioId, {
    $pull: { collaborators: { user: { $in: collaborators } } }
  });

  await setScenarioHasChanges({ scenarioId }, {}, context);

  return {};

};