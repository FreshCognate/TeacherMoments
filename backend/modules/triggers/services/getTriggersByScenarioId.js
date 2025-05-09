import checkHasAccessToScenario from "../../scenarios/helpers/checkHasAccessToScenario.js";

export default async (props, options, context) => {

  const {
    scenarioId,
  } = props;

  await checkHasAccessToScenario({ modelId: scenarioId, modelType: 'Scenario' }, context);

  let {
    isDeleted = false
  } = options;

  const { models } = context;

  const search = { scenario: scenarioId, isDeleted };

  const triggers = await models.Trigger.find(search).sort('sortOrder');

  return {
    triggers
  };

};