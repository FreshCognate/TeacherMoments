import omit from 'lodash/omit.js';
import duplicateBlocks from '../../blocks/services/duplicateBlocks.js';

export default async ({ slideId, newScenarioId }, context) => {
  const { models, session } = context;

  const slide = await models.Slide.findById(slideId);

  const duplicatedSlideObject = omit(slide, ['_id', 'ref']);
  duplicatedSlideObject.scenario = newScenarioId;
  duplicatedSlideObject.originalRef = slide.ref;
  duplicatedSlideObject.originalScenario = slide.scenario;
  duplicatedSlideObject.createdAt = new Date();

  const bulkSlides = await models.Slide.create([duplicatedSlideObject], { session });

  const duplicatedSlide = bulkSlides[0];

  await duplicateBlocks({ scenarioId: slide.scenario, slideRef: slide.ref, newScenarioId, newSlideRef: duplicatedSlide.ref }, context);

  return duplicatedSlide;

}