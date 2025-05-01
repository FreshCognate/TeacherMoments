import checkHasAccessToScenario from '../../scenarios/helpers/checkHasAccessToScenario.js';

export default async (props, options, context) => {

  const { slideId } = props;

  const { models } = context;

  await checkHasAccessToScenario({ modelId: slideId, modelType: 'Slide' }, context);

  const slide = await models.Slide.findById(slideId);

  if (!slide) throw { message: 'This slide does not exist', statusCode: 404 };

  return slide;

};