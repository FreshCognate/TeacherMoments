import populateTracking from "../helpers/populateTracking.js";

export default async (props, options, context) => {

  const {
    scenarioId,
    update
  } = props;

  const { models, user } = context;

  const search = { scenario: scenarioId, user: user._id, isDeleted: false };

  const originalTracking = await models.Tracking.findOne(search);

  if (update.isComplete && !originalTracking.isComplete) {
    update.completedAt = new Date();
  }

  if (update.isConsentAcknowledged && !originalTracking.isConsentAcknowledged) {
    update.consentAcknowledgedAt = new Date();
  }

  if (update.hasGivenConsent && !originalTracking.hasGivenConsent) {
    update.givenConsentAt = new Date();
  }

  let tracking = await models.Tracking.findOneAndUpdate(search, { ...update, updatedAt: new Date(), updatedBy: user._id }, { new: true }).lean();

  tracking = await populateTracking({ tracking }, context);

  return tracking;

};