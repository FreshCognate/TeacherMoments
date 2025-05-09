import checkHasAccessToScenario from "../../scenarios/helpers/checkHasAccessToScenario.js";
import setScenarioHasChanges from "../../scenarios/services/setScenarioHasChanges.js";

export default async (props, options, context) => {

  const { triggerId, update } = props;

  const { models } = context;

  await checkHasAccessToScenario({ modelId: triggerId, modelType: 'Trigger' }, context);

  const trigger = await models.Trigger.findByIdAndUpdate(triggerId, update, { new: true });

  if (!trigger) throw { message: 'This trigger does not exist', statusCode: 404 };

  setScenarioHasChanges({ scenarioId: trigger.scenario }, {}, context);

  return trigger;

};