import setScenarioHasChanges from '../../scenarios/services/setScenarioHasChanges.js';

export default async ({ scenario, slideId, sourceIndex, destinationIndex }, context) => {

  const { models, connection } = context;

  const existingSlide = await models.Slide.findById(slideId);

  if (!existingSlide) throw { message: "This slide does not exist", statusCode: 404 };

  // if (update.sourceIndex !== update.destinationIndex) {

  //   const section = await models.Section.findById(sectionId);
  //   const sections = await models.Section.find({ pageRef: section.pageRef, isDeleted: false }).sort('sortOrder').exec();

  //   const result = Array.from(sections);
  //   const [removed] = result.splice(update.sourceIndex, 1);
  //   result.splice(update.destinationIndex, 0, removed);

  //   let index = 0;
  //   for (const item of result) {
  //     item.sortOrder = index;
  //     await item.save();
  //     index++;
  //   }

  //   const { updatePage } = getModule('Pages');

  //   updatePage({ pageRef: section.pageRef, update: { updatedBy: user._id, updatedAt: new Date() }, options }, context);

  //   return section;

  // }

  if (sourceIndex === destinationIndex) return existingSlide;

  await connection.transaction(async (session) => {

    const slides = await models.Slide.find({ scenario: existingSlide.scenario, parentRef: existingSlide.parentRef, isDeleted: false }).sort('sortOrder').session(session).exec();

    const result = Array.from(slides);
    const [removed] = result.splice(sourceIndex, 1);
    result.splice(destinationIndex, 0, removed);

    let index = 0;
    for (const item of result) {
      item.sortOrder = index;
      await item.save();
      index++;
    }


  }).catch(err => {
    console.log(err);
    throw { message: err, statusCode: 500 };
  });

  setScenarioHasChanges({ scenarioId: existingSlide.scenario }, {}, context);

  return existingSlide;

}