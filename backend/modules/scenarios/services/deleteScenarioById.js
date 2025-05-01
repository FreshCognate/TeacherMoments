import checkHasAccessToScenario from '../helpers/checkHasAccessToScenario.js';

export default async (props, options, context) => {

  const { scenarioId } = props;
  const { models, user } = context;

  await checkHasAccessToScenario({ modelId: scenarioId, modelType: 'Scenario' }, context);

  const scenario = await models.Scenario.findByIdAndUpdate(scenarioId, {
    isDeleted: true,
    deletedAt: new Date(),
    deletedBy: user._id
  }, { new: true });

  if (!scenario) throw { message: 'This scenario does not exist', statusCode: 404 };

  return scenario;

};