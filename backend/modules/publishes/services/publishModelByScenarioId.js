export default async (props, options, context) => {
  const { model, scenarioId } = props;
  const { models } = context;
  await models[`Published_${model}`].deleteMany({ scenario: scenarioId });

  const draftModels = await models[model].find({ scenario: scenarioId, isDeleted: false });
  // Publish models by pushing to the new collection
  for (const draftModel of draftModels) {
    await models[`Published_${model}`].create(draftModel.toJSON());
  }
}