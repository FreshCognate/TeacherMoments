import setScenarioHasChanges from "../../scenarios/services/setScenarioHasChanges.js";
import checkHasAccessToScenario from '../../scenarios/helpers/checkHasAccessToScenario.js';
import deleteStemsBySlideRef from '../../stems/services/deleteStemsBySlideRef.js';
import deleteTriggersBySlideRefs from '../../triggers/services/deleteTriggersBySlideRefs.js';

export default async (props, options, context) => {

  const { slideId } = props;

  const { models, user, connection } = context;

  await checkHasAccessToScenario({ modelId: slideId, modelType: 'Slide' }, context);

  const existingSlide = await models.Slide.findById(slideId);

  if (!existingSlide) throw { message: 'This slide does not exist', statusCode: 404 };

  let slide;

  await connection.transaction(async (session) => {

    const deletedAt = new Date();

    slide = await models.Slide.findByIdAndUpdate(slideId, {
      isDeleted: true,
      deletedAt,
      deletedBy: user._id
    }, { new: true, session });

    // Update all sibling slides
    const siblingSlides = await models.Slide.find({ scenario: slide.scenario, stemRef: slide.stemRef, isDeleted: false }).sort('sortOrder').session(session);

    let sortOrder = 0;
    for (const siblingSlide of siblingSlides) {
      siblingSlide.sortOrder = sortOrder;
      sortOrder++;
      await siblingSlide.save({ session });
    }

    await models.Block.updateMany(
      { slideRef: slide.ref, isDeleted: false },
      { isDeleted: true, deletedAt, deletedBy: user._id },
      { session }
    );

    await deleteTriggersBySlideRefs({ slideRefs: [slide.ref], deletedAt }, {}, { ...context, session });

    await deleteStemsBySlideRef({ slideRef: slide.ref, deletedAt }, {}, { ...context, session });

  }).catch(err => {
    throw { message: err, statusCode: 500 };
  });

  setScenarioHasChanges({ scenarioId: slide.scenario }, {}, context);

  return slide;

};
