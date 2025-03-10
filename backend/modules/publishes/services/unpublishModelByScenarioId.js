export default async ({ model, scenarioId }, context) => {
  const { models } = context;
  await models[`Published_${model}`].deleteMany({ scenario: scenarioId });
}