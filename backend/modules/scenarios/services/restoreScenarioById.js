import getScenarioCollaboratorsPopulate from "../helpers/getScenarioCollaboratorsPopulate.js";

export default async (props, options, context) => {

  const { scenarioId } = props;
  const { models, user } = context;

  const update = {
    isDeleted: false,
    deletedAt: null,
    deletedBy: null,
    updatedAt: new Date(),
    updatedBy: user._id
  }

  const { path, select } = getScenarioCollaboratorsPopulate();

  const scenario = await models.Scenario.findByIdAndUpdate(scenarioId, update, { new: true }).populate(path, select);

  if (!scenario) throw { message: 'This scenario does not exist', statusCode: 404 };

  return scenario;

};