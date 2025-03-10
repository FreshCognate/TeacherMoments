export default async (props, options, context) => {
  const { model, scenarioId } = props;
  const { models } = context;
  await models[`Published_${model}`].deleteMany({ scenario: scenarioId });
}