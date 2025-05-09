export default async ({ modelId, modelType }, { user, models }) => {
  let scenarioId;
  switch (modelType) {
    case 'Scenario':
      scenarioId = modelId;
      break;
    case 'Slide':
      const slide = await models.Slide.findById(modelId, 'scenario');
      scenarioId = slide?.scenario;
      break;
    case 'Block':
      const block = await models.Block.findById(modelId, 'scenario');
      scenarioId = block?.scenario;
      break;
    case 'Trigger':
      const trigger = await models.Trigger.findById(modelId, 'scenario');
      scenarioId = trigger?.scenario;
      break;
  }

  if (!scenarioId) {
    throw { message: 'You do not have access to this scenario', statusCode: 401 };
  }

  const scenario = await models.Scenario.findOne({
    _id: scenarioId,
    collaborators: {
      $elemMatch: {
        user: user._id,
        role: { $in: ['OWNER', 'AUTHOR'] }
      }
    }
  });

  if (!scenario) {
    throw { message: 'You do not have access to this scenario', statusCode: 401 };
  }

}