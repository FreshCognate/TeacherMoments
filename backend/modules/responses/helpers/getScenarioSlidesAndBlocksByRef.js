export default async ({ scenarioId }, { models }) => {

  const scenarioSlides = await models.Slide.find({ scenario: scenarioId, isDeleted: false });

  const slidesByRef = {};

  for (const scenarioSlide of scenarioSlides) {
    slidesByRef[String(scenarioSlide.ref)] = scenarioSlide;
  }

  const scenarioBlocks = await models.Block.find({ scenario: scenarioId, isDeleted: false });

  const blocksByRef = {};

  for (const scenarioBlock of scenarioBlocks) {
    blocksByRef[String(scenarioBlock.ref)] = scenarioBlock;
  }

  return { slidesByRef, blocksByRef };

};
