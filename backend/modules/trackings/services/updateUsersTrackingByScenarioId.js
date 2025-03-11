export default async (props, options, context) => {

  const {
    scenarioId,
    update
  } = props;

  const { models, user } = context;

  const search = { scenario: scenarioId, user: user._id, isDeleted: false };

  let tracking = await models.Tracking.findOneAndUpdate(search, { ...update, updatedAt: new Date(), updatedBy: user._id }, { new: true });

  return tracking;

};