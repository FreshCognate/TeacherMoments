import populateRun from "../helpers/populateRun.js";

export default async (props, options, context) => {

  const {
    scenarioId,
  } = props;

  const { models, user } = context;

  const search = { scenario: scenarioId, user: user._id, isDeleted: false };

  let run = await models.Run.findOne(search).lean();

  if (!run) {
    run = await models.Run.create({
      scenario: scenarioId,
      user: user._id,
      createdAt: new Date(),
      createdBy: user._id
    })
  } else {
    run = await populateRun({ run }, context);
  }

  return run;

};