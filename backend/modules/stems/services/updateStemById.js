import setScenarioHasChanges from '../../scenarios/services/setScenarioHasChanges.js';
import checkHasAccessToScenario from '../../scenarios/helpers/checkHasAccessToScenario.js';

export default async (props, options, context) => {

  const { stemId, update } = props;

  const { models } = context;

  await checkHasAccessToScenario({ modelId: stemId, modelType: 'Stem' }, context);

  const stem = await models.Stem.findByIdAndUpdate(stemId, update, { new: true });

  if (!stem) throw { message: 'This stem does not exist', statusCode: 404 };

  setScenarioHasChanges({ scenarioId: stem.scenario }, {}, context);

  return stem;

};
