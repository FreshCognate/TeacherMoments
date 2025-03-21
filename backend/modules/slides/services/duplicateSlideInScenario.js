import omit from 'lodash/omit.js';
import duplicateBlocks from '../../blocks/services/duplicateBlocks.js';
import setScenarioHasChanges from '../../scenarios/services/setScenarioHasChanges.js';

export default async ({ scenario, parentId, slideId, sortOrder }, context) => {

  const { models, connection } = context;

  const existingSlide = await models.Slide.findById(slideId);

  if (!existingSlide) throw { message: "This slide does not exist", statusCode: 404 };

  let duplicatedSlide;

  await connection.transaction(async (session) => {

    const duplicatedSlideObject = omit(existingSlide, ['_id', 'ref']);
    duplicatedSlideObject.scenario = scenario;
    duplicatedSlideObject.originalRef = existingSlide.ref;
    duplicatedSlideObject.originalScenario = existingSlide.scenario;
    duplicatedSlideObject.isRoot = false;
    duplicatedSlideObject.createdAt = new Date();
    duplicatedSlideObject.children = [];

    const bulkSlides = await models.Slide.create([duplicatedSlideObject], { session });

    duplicatedSlide = bulkSlides[0];

    const parentSlide = await models.Slide.findById(parentId).session(session);

    const children = parentSlide.children;

    children.splice(sortOrder, 0, duplicatedSlide.ref);

    await parentSlide.save();

    await duplicateBlocks({ scenarioId: existingSlide.scenario, slideRef: existingSlide.ref, newScenarioId: scenario, newSlideRef: duplicatedSlide.ref }, { ...context, session });

    setScenarioHasChanges({ scenarioId: existingSlide.scenario }, {}, context);

  }).catch(err => {
    throw { message: err, statusCode: 500 };
  });

  return duplicatedSlide;

}