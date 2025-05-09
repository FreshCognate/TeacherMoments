import checkHasAccessToScenario from "../../scenarios/helpers/checkHasAccessToScenario.js";
import setScenarioHasChanges from "../../scenarios/services/setScenarioHasChanges.js";

export default async (props, options, context) => {

  const { triggerId } = props;

  const { models, user } = context;

  await checkHasAccessToScenario({ modelId: triggerId, modelType: 'Trigger' }, context);

  const trigger = await models.Trigger.findByIdAndUpdate(triggerId, {
    isDeleted: true,
    deletedAt: new Date(),
    deletedBy: user._id
  }, { new: true });

  if (!trigger) throw { message: 'This trigger does not exist', statusCode: 404 };

  const elementTriggers = await models.Trigger.find({
    scenario: trigger.scenario,
    triggerType: trigger.triggerType,
    elementRef: trigger.elementRef,
    event: trigger.event,
    isDeleted: false
  }).sort('sortOrder');

  let sortOrder = 0;
  for (const elementTrigger of elementTriggers) {
    elementTrigger.sortOrder = sortOrder;
    sortOrder++;
    await elementTrigger.save();
  }

  setScenarioHasChanges({ scenarioId: trigger.scenario }, {}, context);

  return trigger;

};