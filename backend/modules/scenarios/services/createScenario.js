import createSlide from "../../slides/services/createSlide.js";

export default async (props, options, context) => {

  const { name, accessType } = props;
  const { models, user } = context;

  if (!name) throw { message: "A scenario must have a name", statusCode: 400 };

  const newScenarioObject = {
    name,
    accessType,
    createdBy: user._id,
    collaborators: [{
      user: user._id,
      role: 'OWNER'
    }]
  };

  const scenario = await models.Scenario.create(newScenarioObject);

  // When creating a new scenario we should create the first slide too
  const newSlideObject = {
    name: 'Introduction',
    scenario: scenario._id,
  }

  await createSlide(newSlideObject, options, context);

  return scenario;

};