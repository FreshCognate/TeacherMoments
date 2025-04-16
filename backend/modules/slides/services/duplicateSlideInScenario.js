import omit from 'lodash/omit.js';
import duplicateBlocks from '../../blocks/services/duplicateBlocks.js';
import setScenarioHasChanges from '../../scenarios/services/setScenarioHasChanges.js';

export default async ({ scenario, parentId, slideId }, context) => {

  const { models, connection } = context;

  const existingSlide = await models.Slide.findById(slideId);

  if (!existingSlide) throw { message: "This slide does not exist", statusCode: 404 };

  let duplicatedSlide;

  const newSortOrder = existingSlide.sortOrder + 1;

  await connection.transaction(async (session) => {

    const duplicatedSlideObject = omit(existingSlide, ['_id', 'ref']);
    duplicatedSlideObject.scenario = scenario;
    duplicatedSlideObject.originalRef = existingSlide.ref;
    duplicatedSlideObject.originalScenario = existingSlide.scenario;
    duplicatedSlideObject.createdAt = new Date();
    duplicatedSlideObject.sortOrder = newSortOrder;

    const bulkSlides = await models.Slide.create([duplicatedSlideObject], { session });

    duplicatedSlide = bulkSlides[0];

    // Need to sort the sort order of existing slides
    const scenarioSlides = await models.Slide.find({ scenario: scenario, isDeleted: false });

    for (const scenarioSlide of scenarioSlides) {
      if (scenarioSlide.sortOrder >= newSortOrder) {
        scenarioSlide.sortOrder = scenarioSlide.sortOrder + 1;
        await scenarioSlide.save({ session });
      }
    }

    await duplicateBlocks({ scenarioId: existingSlide.scenario, slideRef: existingSlide.ref, newScenarioId: scenario, newSlideRef: duplicatedSlide.ref }, { ...context, session });

    setScenarioHasChanges({ scenarioId: existingSlide.scenario }, {}, context);

  }).catch(err => {
    console.log(err);
    throw { message: err, statusCode: 500 };
  });

  return duplicatedSlide;

}