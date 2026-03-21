import checkHasAccessToScenario from '../../scenarios/helpers/checkHasAccessToScenario.js';

export default async (props, options, context) => {

  const { stemId } = props;

  const { models } = context;

  await checkHasAccessToScenario({ modelId: stemId, modelType: 'Stem' }, context);

  const stem = await models.Stem.findById(stemId);

  if (!stem) throw { message: 'This stem does not exist', statusCode: 404 };

  return stem;

};
