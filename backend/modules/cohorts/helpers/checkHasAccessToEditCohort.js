import hasUserGotPermissions from '#core/authentication/helpers/hasUserGotPermissions.js';

export default async ({ cohortId }, { user, models }) => {

  if (!cohortId) {
    throw { message: 'You do not have access to this cohort', statusCode: 401 };
  }

  if (hasUserGotPermissions(user, ['SUPER_ADMIN'])) {
    return await models.Cohort.findById(cohortId);
  }

  const cohort = await models.Cohort.findOne({
    _id: cohortId,
    collaborators: {
      $elemMatch: {
        user: user._id,
        role: { $in: ['OWNER', 'AUTHOR'] }
      }
    }
  });

  if (cohort) {
    return cohort;
  }

  if (!cohort) {
    throw { message: 'You do not have access to this cohort', statusCode: 401 };
  }

}