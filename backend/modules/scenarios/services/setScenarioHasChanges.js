export default async (props, options, context) => {

  const { scenarioId } = props;
  const { models, user } = context;

  await models.Scenario.findByIdAndUpdate(scenarioId, { hasChanges: true, updatedAt: new Date(), updatedBy: user._id });

}