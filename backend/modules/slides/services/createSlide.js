import setScenarioHasChanges from "../../scenarios/services/setScenarioHasChanges.js";
import checkHasAccessToScenario from '../../scenarios/helpers/checkHasAccessToScenario.js';

export default async (props, options, context) => {

  const { scenario, sortOrder, stemRef } = props;

  const { models, user } = context;

  await checkHasAccessToScenario({ modelId: scenario, modelType: 'Scenario' }, context);

  const scenarioModel = await models.Scenario.findById(scenario);

  if (!scenarioModel) throw { message: "This scenario does not exist", statusCode: 400 };

  const scenarioSlides = await models.Slide.find({ scenario: scenario, stemRef: stemRef, isDeleted: false });

  for (const scenarioSlide of scenarioSlides) {
    if (scenarioSlide.sortOrder >= sortOrder) {
      scenarioSlide.sortOrder = scenarioSlide.sortOrder + 1;
      await scenarioSlide.save();
    }
  }

  const newSlideObject = {
    scenario,
    stemRef,
    createdBy: user._id,
    sortOrder
  };

  const slide = await models.Slide.create(newSlideObject);

  setScenarioHasChanges({ scenarioId: scenario }, {}, context);

  return slide;

};