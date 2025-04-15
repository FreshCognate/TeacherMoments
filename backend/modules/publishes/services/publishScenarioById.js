import getPublishLink from "../helpers/getPublishLink.js";
import publishModelByScenarioId from "./publishModelByScenarioId.js";

export default async (props, options, context) => {

  const { scenarioId } = props;
  const { models, user } = context;

  const scenario = await models.Scenario.findById(scenarioId);

  if (!scenario) throw { message: 'This scenario does not exist', statusCode: 404 };

  await publishModelByScenarioId({ model: 'Slide', scenarioId }, {}, context);
  await publishModelByScenarioId({ model: 'Block', scenarioId }, {}, context);
  await publishModelByScenarioId({ model: 'Trigger', scenarioId }, {}, context);

  scenario.hasChanges = false;
  scenario.isPublished = true;
  scenario.publishedAt = new Date();
  scenario.publishedBy = user._id;
  if (!scenario.publishLink) {
    scenario.publishLink = await getPublishLink({ name: scenario.name, Model: models.Scenario });
  }

  await scenario.save();

  await models.Published_Scenario.deleteOne({ _id: scenarioId });
  await models.Published_Scenario.create(scenario.toJSON());

  return scenario;

};