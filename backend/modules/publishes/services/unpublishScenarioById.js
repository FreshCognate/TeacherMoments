import unpublishModelByScenarioId from "./unpublishModelByScenarioId.js";

export default async (props, options, context) => {

  const { scenarioId } = props;
  const { models, user } = context;

  const scenario = await models.Scenario.findById(scenarioId);

  if (!scenario) throw { message: 'This scenario does not exist', statusCode: 404 };

  if (!scenario.isPublished) throw { message: 'This scenario is not publishd', statusCode: 400 };

  await unpublishModelByScenarioId({ model: 'Slide', scenarioId }, {}, context);
  await unpublishModelByScenarioId({ model: 'Block', scenarioId }, {}, context);
  await unpublishModelByScenarioId({ model: 'Trigger', scenarioId }, {}, context);

  await models.Published_Scenario.deleteOne({ _id: scenarioId });

  scenario.hasChanges = true;
  scenario.isPublished = false;
  scenario.publishedAt = null;
  scenario.publishedBy = null;
  await scenario.save();

  return scenario;

};