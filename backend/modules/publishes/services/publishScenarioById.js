import getScenarioCollaboratorsPopulate from "../../scenarios/helpers/getScenarioCollaboratorsPopulate.js";

export default async (props, options, context) => {

  const { scenarioId } = props;
  const { models, user } = context;

  const { path, select } = getScenarioCollaboratorsPopulate();

  const scenario = await models.Scenario.findById(scenarioId).populate(path, select);

  if (!scenario) throw { message: 'This scenario does not exist', statusCode: 404 };

  scenario.isPublished = true;
  scenario.publishedAt = new Date();
  scenario.publishedBy = user._id;
  await scenario.save();

  return scenario;

};