export default async (props, options, context) => {

  const { name, scenario, parent } = props;

  const { models, user } = context;

  const scenarioModel = await models.Scenario.findById(scenario);

  if (!scenarioModel) throw { message: "This scenario does not exist", statusCode: 400 };

  const scenarioSlides = await models.Slide.find({ scenario: scenario, isDeleted: false });

  const sortOrder = scenarioSlides.length;

  const newSlideObject = {
    name,
    scenario,
    createdBy: user._id,
    sortOrder,
    isRoot: sortOrder === 0,
  };

  const slide = await models.Slide.create(newSlideObject);

  // If parent is provided, we need to update the parent slide to have the new slide as a child
  if (parent) {
    const parentSlide = await models.Slide.findById(parent);
    parentSlide.children.push(slide._id);
    await parentSlide.save();
  }

  return slide;

};