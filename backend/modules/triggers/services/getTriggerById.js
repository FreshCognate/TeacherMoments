import checkHasAccessToScenario from "../../scenarios/helpers/checkHasAccessToScenario.js";

export default async (props, options, context) => {

  const { triggerId } = props;

  const { models } = context;

  await checkHasAccessToScenario({ modelId: triggerId, modelType: 'Trigger' }, context);

  const trigger = await models.Trigger.findById(triggerId);

  if (!trigger) throw { message: 'This trigger does not exist', statusCode: 404 };

  return trigger;

};