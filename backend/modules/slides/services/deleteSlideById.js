export default async (props, options, context) => {

  const { slideId } = props;

  const { models, user } = context;

  const deletedAt = new Date();

  const slide = await models.Slide.findByIdAndUpdate(slideId, {
    isRoot: false,
    isDeleted: true,
    deletedAt,
    deletedBy: user._id
  }, { new: true });

  if (!slide) throw { message: 'This slide does not exist', statusCode: 404 };

  // Remove slide from any children
  await models.Slide.updateMany({ children: slide.ref }, { $pull: { children: slide.ref } });

  await models.Block.updateMany({ slideRef: slide.ref }, { isDeleted: true, deletedAt, deletedBy: user._id });

  return slide;

};