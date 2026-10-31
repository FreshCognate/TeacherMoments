import setScenarioHasChanges from '../../scenarios/services/setScenarioHasChanges.js';
import checkHasAccessToScenario from '../../scenarios/helpers/checkHasAccessToScenario.js';
import find from 'lodash/find.js';
import map from 'lodash/map.js';
import omit from 'lodash/omit.js';

const mergeBranchingOptions = ({ currentBranchingOptions, incomingBranchingOptions }) => {
  return map(currentBranchingOptions, (currentBranchingOption) => {
    const incomingBranchingOption = find(incomingBranchingOptions, (branchingOption) => {
      return String(branchingOption.stemRef) === String(currentBranchingOption.stemRef);
    });

    if (!incomingBranchingOption) return currentBranchingOption;

    return {
      ...currentBranchingOption,
      ...omit(incomingBranchingOption, ['_id', 'stemRef'])
    };
  });
};

export default async (props, options, context) => {

  const { stemId, update } = props;

  const { models } = context;

  await checkHasAccessToScenario({ modelId: stemId, modelType: 'Stem' }, context);

  if (update.defaultBranchingStemRef === '') update.defaultBranchingStemRef = null;

  if (update.branchingOptions) {
    const currentStem = await models.Stem.findById(stemId).lean();

    if (!currentStem) throw { message: 'This stem does not exist', statusCode: 404 };

    update.branchingOptions = mergeBranchingOptions({
      currentBranchingOptions: currentStem.branchingOptions,
      incomingBranchingOptions: update.branchingOptions
    });
  }

  const stem = await models.Stem.findByIdAndUpdate(stemId, update, { new: true });

  if (!stem) throw { message: 'This stem does not exist', statusCode: 404 };

  setScenarioHasChanges({ scenarioId: stem.scenario }, {}, context);

  return stem;

};
