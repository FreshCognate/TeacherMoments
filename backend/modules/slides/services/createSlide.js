import setScenarioHasChanges from "../../scenarios/services/setScenarioHasChanges.js";

export default async (props, options, context) => {

  const { scenario, parentId } = props;

  const { models, user } = context;

  const scenarioModel = await models.Scenario.findById(scenario);

  if (!scenarioModel) throw { message: "This scenario does not exist", statusCode: 400 };

  const scenarioSlides = await models.Slide.find({ scenario: scenario, isDeleted: false });

  const newSlideObject = {
    scenario,
    createdBy: user._id,
    isRoot: scenarioSlides.length === 0,
  };

  const slide = await models.Slide.create(newSlideObject);

  // If parent is provided, we need to update the parent slide to have the new slide as a child
  if (parentId) {
    const parentSlide = await models.Slide.findById(parentId);
    parentSlide.children.push(slide.ref);
    await parentSlide.save();
  }

  setScenarioHasChanges({ scenarioId: scenario }, {}, context);

  return slide;

};