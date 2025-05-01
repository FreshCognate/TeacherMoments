import checkHasAccessToScenario from '../../scenarios/helpers/checkHasAccessToScenario.js';

export default async (props, options, context) => {

  const { slideId } = props;

  const { models, user } = context;

  await checkHasAccessToScenario({ modelId: slideId, modelType: 'Slide' }, context);

  const update = {
    isDeleted: false,
    deletedAt: null,
    deletedBy: null,
    updatedAt: new Date(),
    updatedBy: user._id
  }

  const slide = await models.Slide.findByIdAndUpdate(slideId, update, { new: true });

  if (!slide) throw { message: 'This slide does not exist', statusCode: 404 };

  return slide;

};