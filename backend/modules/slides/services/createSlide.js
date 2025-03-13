import setScenarioHasChanges from "../../scenarios/services/setScenarioHasChanges.js";

export default async (props, options, context) => {

  const { scenario, sortOrder } = props;

  const { models, user } = context;

  const scenarioModel = await models.Scenario.findById(scenario);

  if (!scenarioModel) throw { message: "This scenario does not exist", statusCode: 400 };

  const scenarioSlides = await models.Slide.find({ scenario: scenario, isDeleted: false });

  const newSlideObject = {
    scenario,
    createdBy: user._id,
    sortOrder
  };

  const slide = await models.Slide.create(newSlideObject);

  setScenarioHasChanges({ scenarioId: scenario }, {}, context);

  return slide;

};