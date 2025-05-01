import checkHasAccessToScenario from '../helpers/checkHasAccessToScenario.js';
import getScenarioCollaboratorsPopulate from "../helpers/getScenarioCollaboratorsPopulate.js";

export default async (props, options, context) => {

  const { scenarioId } = props;
  const { models } = context;

  await checkHasAccessToScenario({ modelId: scenarioId, modelType: 'Scenario' }, context);

  const { path, select } = getScenarioCollaboratorsPopulate();

  const scenario = await models.Scenario.findById(scenarioId).populate(path, select);

  if (!scenario) throw { message: 'This scenario does not exist', statusCode: 404 };

  return scenario;

};