import duplicateSlide from './duplicateSlide.js';

export default async ({ scenarioId, newScenarioId }, context) => {

  const { models } = context;

  const slides = await models.Slide.find({ scenario: scenarioId, isDeleted: false });

  const duplicatedSlides = [];

  for (const slide of slides) {
    const duplicatedSlide = await duplicateSlide({ slideId: slide._id, newScenarioId }, context);
    duplicatedSlides.push(duplicatedSlide);
  }

  return duplicatedSlides;

}