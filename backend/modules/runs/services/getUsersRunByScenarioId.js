import populateRun from "../helpers/populateRun.js";

export default async (props, options, context) => {

  const {
    scenarioId,
    cohortId,
  } = props;

  const { models, user } = context;

  const search = { scenario: scenarioId, user: user._id, isDeleted: false, isComplete: false };

  const createdAt = new Date();
  const createdBy = user._id;

  if (cohortId) {
    const tracking = await models.Tracking.findOne({ cohort: cohortId, user: user._id, isDeleted: false });
    if (!tracking) {
      await models.Tracking.create({
        cohort: cohortId,
        user: createdBy,
        createdAt,
        createdBy
      });
    } else {
      tracking.updatedAt = createdAt;
      tracking.updatedBy = createdBy;
      await tracking.save();
    }
  }

  let run = await models.Run.findOne(search).lean();

  if (!run) {
    run = await models.Run.create({
      scenario: scenarioId,
      user: user._id,
      createdAt,
      createdBy
    })
  } else {
    run = await populateRun({ run }, context);
  }

  return run;

};