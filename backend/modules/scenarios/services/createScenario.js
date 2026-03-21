import createSlide from "../../slides/services/createSlide.js";
import createStem from "../../stems/services/createStem.js";

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

  const stem = await createStem({ scenario: scenario._id, name: 'Stem 1', isRoot: true }, {}, context);

  await createSlide({ scenario: scenario._id, sortOrder: 0, stemRef: stem.ref }, {}, context);

  return scenario;

};