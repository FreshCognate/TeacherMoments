import populateRun from "../helpers/populateRun.js";

export default async (props, options, context) => {

  const {
    scenarioId,
    update
  } = props;

  const { models, user } = context;

  const search = { scenario: scenarioId, user: user._id, isDeleted: false, isArchived: false };

  const originalRun = await models.Run.findOne(search);

  if (update.isArchived && !originalRun.isArchived) {
    update.archivedAt = new Date();
  }

  if (update.isComplete && !originalRun.isComplete) {
    update.completedAt = new Date();
  }

  if (update.isConsentAcknowledged && !originalRun.isConsentAcknowledged) {
    update.consentAcknowledgedAt = new Date();
  }

  if (update.hasGivenConsent && !originalRun.hasGivenConsent) {
    update.givenConsentAt = new Date();
  }

  let run = await models.Run.findOneAndUpdate(search, { ...update, updatedAt: new Date(), updatedBy: user._id }, { new: true }).lean();

  run = await populateRun({ run }, context);

  return run;

};