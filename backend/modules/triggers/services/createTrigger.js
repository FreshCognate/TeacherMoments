import setScenarioHasChanges from "../../scenarios/services/setScenarioHasChanges.js";
import checkHasAccessToScenario from '../../scenarios/helpers/checkHasAccessToScenario.js';

export default async (props, options, context) => {

  const { scenario, triggerType, elementRef, action } = props;

  await checkHasAccessToScenario({ modelId: scenario, modelType: 'Scenario' }, context);

  const { models, user } = context;

  let elementTriggerItems = await models.Trigger.find({ scenario, triggerType, elementRef, isDeleted: false });

  const sortOrder = elementTriggerItems.length;

  const newTriggerObject = {
    scenario,
    triggerType,
    elementRef,
    action,
    sortOrder,
    createdBy: user._id,
  };

  const trigger = await models.Trigger.create(newTriggerObject);

  setScenarioHasChanges({ scenarioId: scenario }, {}, context);

  return trigger;

};