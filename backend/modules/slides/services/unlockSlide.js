import { getSockets } from "#core/io/index.js";
import checkHasAccessToScenario from '../../scenarios/helpers/checkHasAccessToScenario.js';

export default async (props, options, context) => {

  const { slideId } = props;

  const { models, user } = context;

  await checkHasAccessToScenario({ modelId: slideId, modelType: 'Slide' }, context);

  const slide = await models.Slide.findByIdAndUpdate(slideId, { isLocked: false, lockedAt: null, lockedBy: null }, { new: true });

  const sockets = getSockets();

  sockets.emit(`SCENARIO:${slide.scenario}_EVENT:SLIDE_LOCK_STATUS`, { slide, userId: user._id });

  return slide;

}