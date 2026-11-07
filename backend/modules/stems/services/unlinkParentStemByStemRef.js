import setScenarioHasChanges from '../../scenarios/services/setScenarioHasChanges.js';
import checkHasAccessToScenario from '../../scenarios/helpers/checkHasAccessToScenario.js';

export default async (props, options, context) => {

  const { stemId, parentStemRef } = props;

  const { models } = context;

  await checkHasAccessToScenario({ modelId: stemId, modelType: 'Stem' }, context);

  const stem = await models.Stem.findById(stemId);

  if (!stem) throw { message: 'This stem does not exist', statusCode: 404 };

  const parentStemCount = await models.Stem.countDocuments({
    scenario: stem.scenario,
    'branchingOptions.stemRef': stem.ref,
    isDeleted: false
  });

  if (parentStemCount < 2) throw { message: 'A stem must keep at least one parent', statusCode: 400 };

  await models.Stem.updateOne(
    { scenario: stem.scenario, ref: parentStemRef, isDeleted: false },
    { $pull: { branchingOptions: { stemRef: stem.ref } } }
  );

  await models.Stem.updateOne(
    { scenario: stem.scenario, ref: parentStemRef, defaultBranchingStemRef: stem.ref },
    { defaultBranchingStemRef: null }
  );

  setScenarioHasChanges({ scenarioId: stem.scenario }, {}, context);

  return stem;

};
