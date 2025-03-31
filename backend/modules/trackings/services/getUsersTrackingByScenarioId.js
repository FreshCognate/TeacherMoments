import populateTracking from "../helpers/populateTracking.js";

export default async (props, options, context) => {

  const {
    scenarioId,
  } = props;

  const { models, user } = context;

  const search = { scenario: scenarioId, user: user._id, isDeleted: false };

  let tracking = await models.Tracking.findOne(search).lean();

  if (!tracking) {
    tracking = await models.Tracking.create({
      scenario: scenarioId,
      user: user._id,
      createdAt: new Date(),
      createdBy: user._id
    })
  } else {
    tracking = await populateTracking({ tracking }, context);
  }

  return tracking;

};