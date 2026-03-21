import setScenarioHasChanges from '../../scenarios/services/setScenarioHasChanges.js';
import checkHasAccessToScenario from '../../scenarios/helpers/checkHasAccessToScenario.js';
import createSlide from '../../slides/services/createSlide.js';

export default async (props, options, context) => {

  const { scenario, stemRef, sortOrder, name, isRoot } = props;

  const { models, user } = context;

  await checkHasAccessToScenario({ modelId: scenario, modelType: 'Scenario' }, context);

  const scenarioModel = await models.Scenario.findById(scenario);

  if (!scenarioModel) throw { message: 'This scenario does not exist', statusCode: 400 };

  const newStemObject = {
    scenario,
    stemRef,
    sortOrder,
    name,
    isRoot,
    createdBy: user._id
  };

  const newStem = await models.Stem.create(newStemObject);

  if (!isRoot) {
    await createSlide({ scenario, sortOrder: 0, stemRef: newStem.ref }, {}, context);
  }

  setScenarioHasChanges({ scenarioId: scenario }, {}, context);

  return newStem;

};
