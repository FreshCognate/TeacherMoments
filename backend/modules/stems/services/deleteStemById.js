import setScenarioHasChanges from '../../scenarios/services/setScenarioHasChanges.js';
import checkHasAccessToScenario from '../../scenarios/helpers/checkHasAccessToScenario.js';

export default async (props, options, context) => {

  const { stemId } = props;

  const { models, user } = context;

  await checkHasAccessToScenario({ modelId: stemId, modelType: 'Stem' }, context);

  const deletedAt = new Date();

  const stem = await models.Stem.findByIdAndUpdate(stemId, {
    isDeleted: true,
    deletedAt,
    deletedBy: user._id
  }, { new: true });

  if (!stem) throw { message: 'This stem does not exist', statusCode: 404 };

  setScenarioHasChanges({ scenarioId: stem.scenario }, {}, context);

  return stem;

};
