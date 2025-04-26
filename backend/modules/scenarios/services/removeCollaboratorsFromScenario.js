import setScenarioHasChanges from './setScenarioHasChanges.js';
import map from 'lodash/map.js';
import includes from 'lodash/includes.js';

export default async (props, options, context) => {

  const { scenarioId, collaborators } = props;
  const { models } = context;

  const scenario = await models.Scenario.findById(scenarioId);
  if (!scenario) throw { message: 'This scenario does not exist', statusCode: 404 };

  await models.Scenario.findByIdAndUpdate(scenarioId, {
    $pull: { collaborators: { user: { $in: collaborators } } }
  });

  await setScenarioHasChanges({ scenarioId }, {}, context);

  return {};

};