import getScenarioCollaboratorsPopulate from '../helpers/getScenarioCollaboratorsPopulate.js';
import setScenarioHasChanges from './setScenarioHasChanges.js';

export default async (props, options, context) => {

  const { scenarioId, update } = props;
  const { models } = context;

  const { path, select } = getScenarioCollaboratorsPopulate();

  const scenario = await models.Scenario.findByIdAndUpdate(scenarioId, update, { new: true }).populate(path, select);

  if (!scenario) throw { message: 'This scenario does not exist', statusCode: 404 };

  await setScenarioHasChanges({ scenarioId }, {}, context);

  return scenario;

};