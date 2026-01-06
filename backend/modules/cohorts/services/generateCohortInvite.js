import checkHasAccessToEditCohort from '../helpers/checkHasAccessToEditCohort.js';
import generateInviteToken from '../helpers/generateInviteToken.js';
import getCohortCollaboratorsPopulate from '../helpers/getCohortCollaboratorsPopulate.js';

export default async (props, options, context) => {

  const { cohortId } = props;
  const { models, user } = context;

  await checkHasAccessToEditCohort({ cohortId }, context);

  const { path, select } = getCohortCollaboratorsPopulate();

  const createdAt = new Date();
  const createdBy = user._id;

  await models.Cohort.findByIdAndUpdate(cohortId, {
    $set: { 'invites.$[invite].isActive': false },
  }, {
    arrayFilters: [{ 'invite.isActive': true }],
  }).catch(() => {
    // If invites field doesn't exist, ignore the error
  });

  const newInvite = {
    token: generateInviteToken(),
    isActive: true,
    createdBy,
    createdAt
  };

  const cohort = await models.Cohort.findByIdAndUpdate(cohortId, {
    $push: { invites: newInvite },
    updatedBy: createdBy,
    updatedAt: createdAt
  }, {
    new: true,
  }).populate(path, select);

  if (!cohort) throw { message: 'This cohort does not exist', statusCode: 404 };

  return cohort;

};