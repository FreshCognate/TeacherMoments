import { getSockets } from "#core/io/index.js";

export default async (props, options, context) => {

  const { slideId } = props;

  const { models, user } = context;

  const slide = await models.Slide.findById(slideId);

  if (!slide) throw { message: 'This slide does not exist', statusCode: 404 };

  await models.Slide.updateMany({ isLocked: true, lockedBy: user._id }, { isLocked: false, lockedBy: null, lockedAt: null });

  slide.isLocked = true;
  slide.lockedAt = new Date();
  slide.lockedBy = user._id;

  await slide.save();

  const sockets = getSockets();

  sockets.emit(`SCENARIO:${slide.scenario}_EVENT:SLIDE_LOCK_STATUS`, { slide, userId: user._id });

  return slide;

}