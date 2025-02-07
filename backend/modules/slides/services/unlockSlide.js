import { getSockets } from "#core/io/index.js";

export default async (props, options, context) => {

  const { slideId } = props;

  const { models, user } = context;

  const slide = await models.Slide.findByIdAndUpdate(slideId, { isLocked: false, lockedAt: null, lockedBy: null });

  const sockets = getSockets();

  sockets.emit(`SCENARIO:${slide.scenario}_EVENT:SLIDE_LOCK_STATUS`, { slide });

  return slide;

}