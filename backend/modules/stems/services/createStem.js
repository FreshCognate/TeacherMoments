import setScenarioHasChanges from '../../scenarios/services/setScenarioHasChanges.js';
import checkHasAccessToScenario from '../../scenarios/helpers/checkHasAccessToScenario.js';

export default async (props, options, context) => {

  const { scenario, stem, sortOrder, name, isRoot } = props;

  const { models, user } = context;

  await checkHasAccessToScenario({ modelId: scenario, modelType: 'Scenario' }, context);

  const scenarioModel = await models.Scenario.findById(scenario);

  if (!scenarioModel) throw { message: 'This scenario does not exist', statusCode: 400 };

  const newStemObject = {
    scenario,
    stem,
    sortOrder,
    name,
    isRoot,
    createdBy: user._id
  };

  const newStem = await models.Stem.create(newStemObject);

  setScenarioHasChanges({ scenarioId: scenario }, {}, context);

  return newStem;

};
