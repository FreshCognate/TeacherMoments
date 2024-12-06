import getScenarioCollaboratorsPopulate from '../helpers/getScenarioCollaboratorsPopulate.js';

export default async ({ scenarioId, update }, context) => {

  const { models } = context;

  const { path, select } = getScenarioCollaboratorsPopulate();

  const scenario = await models.Scenario.findByIdAndUpdate(scenarioId, update, { new: true }).populate(path, select);

  if (!scenario) throw { message: 'This scenario does not exist', statusCode: 404 };

  return scenario;

};