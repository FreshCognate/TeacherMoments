import setScenarioHasChanges from '../../scenarios/services/setScenarioHasChanges.js';
import checkHasAccessToScenario from '../../scenarios/helpers/checkHasAccessToScenario.js';
import createSlide from '../../slides/services/createSlide.js';

export default async (props, options, context) => {

  const { scenario, stemRef, sortOrder, name, isRoot } = props;

  const { models, user } = context;

  await checkHasAccessToScenario({ modelId: scenario, modelType: 'Scenario' }, context);

  const scenarioModel = await models.Scenario.findById(scenario);

  if (!scenarioModel) throw { message: 'This scenario does not exist', statusCode: 400 };

  const siblingStems = await models.Stem.find({ stemRef, isDeleted: false });

  const newStem = await models.Stem.create({
    scenario,
    stemRef,
    sortOrder: sortOrder || 0,
    name: name || `Stem ${siblingStems.length + 1}`,
    isRoot,
    createdBy: user._id
  });

  if (!isRoot) {
    await createSlide({ scenario, sortOrder: 0, stemRef: newStem.ref }, {}, context);
    if (siblingStems.length === 0) {
      const secondaryStem = await models.Stem.create({
        scenario,
        stemRef,
        sortOrder: sortOrder || 1,
        name: `Stem ${siblingStems.length + 2}`,
        isRoot,
        createdBy: user._id
      });
      await createSlide({ scenario, sortOrder: 0, stemRef: secondaryStem.ref }, {}, context);
    }
  }


  setScenarioHasChanges({ scenarioId: scenario }, {}, context);

  return newStem;

};
