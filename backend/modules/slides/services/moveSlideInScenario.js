import setScenarioHasChanges from '../../scenarios/services/setScenarioHasChanges.js';
import checkHasAccessToScenario from '../../scenarios/helpers/checkHasAccessToScenario.js';

export default async ({ scenario, slideId, sourceIndex, destinationIndex }, context) => {

  const { models, connection } = context;

  await checkHasAccessToScenario({ modelId: slideId, modelType: 'Slide' }, context);

  const existingSlide = await models.Slide.findById(slideId);

  if (!existingSlide) throw { message: "This slide does not exist", statusCode: 404 };

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