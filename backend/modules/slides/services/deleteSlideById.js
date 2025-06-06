import setScenarioHasChanges from "../../scenarios/services/setScenarioHasChanges.js";
import checkHasAccessToScenario from '../../scenarios/helpers/checkHasAccessToScenario.js';

export default async (props, options, context) => {

  const { slideId } = props;

  const { models, user } = context;

  await checkHasAccessToScenario({ modelId: slideId, modelType: 'Slide' }, context);

  const deletedAt = new Date();

  const slide = await models.Slide.findByIdAndUpdate(slideId, {
    isDeleted: true,
    deletedAt,
    deletedBy: user._id
  }, { new: true });

  if (!slide) throw { message: 'This slide does not exist', statusCode: 404 };

  // Update all sibling slides
  const siblingSlides = await models.Slide.find({ scenario: slide.scenario, parentRef: slide.parentRef, isDeleted: false }).sort('sortOrder');

  let sortOrder = 0;
  for (const siblingSlide of siblingSlides) {
    siblingSlide.sortOrder = sortOrder;
    sortOrder++;
    await siblingSlide.save();
  }

  await models.Block.updateMany({ slideRef: slide.ref }, { isDeleted: true, deletedAt, deletedBy: user._id });

  setScenarioHasChanges({ scenarioId: slide.scenario }, {}, context);

  return slide;

};