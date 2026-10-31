import setScenarioHasChanges from '../../scenarios/services/setScenarioHasChanges.js';
import checkHasAccessToScenario from '../../scenarios/helpers/checkHasAccessToScenario.js';
import createSlide from '../../slides/services/createSlide.js';
import map from 'lodash/map.js';

export default async (props, options, context) => {

  const { scenario, parentStemRef, name, isRoot } = props;

  const { models, user } = context;

  await checkHasAccessToScenario({ modelId: scenario, modelType: 'Scenario' }, context);

  const scenarioModel = await models.Scenario.findById(scenario);

  if (!scenarioModel) throw { message: 'This scenario does not exist', statusCode: 400 };

  let parentStem = null;

  if (parentStemRef) {
    parentStem = await models.Stem.findOne({ scenario, ref: parentStemRef, isDeleted: false });
    if (!parentStem) throw { message: 'This parent stem does not exist', statusCode: 400 };
  }

  const siblingCount = parentStem ? parentStem.branchingOptions.length : 0;

  const newStem = await models.Stem.create({
    scenario,
    name: name || `Stem ${siblingCount + 1}`,
    isRoot,
    createdBy: user._id
  });

  const newStems = [newStem];

  if (!isRoot) {
    await createSlide({ scenario, sortOrder: 0, stemRef: newStem.ref }, {}, context);
    if (siblingCount === 0) {
      const secondaryStem = await models.Stem.create({
        scenario,
        name: `Stem ${siblingCount + 2}`,
        isRoot,
        createdBy: user._id
      });
      await createSlide({ scenario, sortOrder: 0, stemRef: secondaryStem.ref }, {}, context);
      newStems.push(secondaryStem);
    }
  }

  if (parentStem) {
    const branchingOptions = map(newStems, (stem) => ({ stemRef: stem.ref, conditions: [] }));
    await models.Stem.updateOne(
      { _id: parentStem._id },
      { $push: { branchingOptions: { $each: branchingOptions } } }
    );
  }

  setScenarioHasChanges({ scenarioId: scenario }, {}, context);

  return newStem;

};
