export default async ({ cohortId }, { user, models }) => {

  if (!cohortId) {
    throw { message: 'You do not have access to this cohort', statusCode: 401 };
  }

  // Check if cohort is in user's cohorts array
  const cohortUser = await models.User.findOne({
    _id: user._id,
    'cohorts.cohort': cohortId
  });

  if (cohortUser) {
    return true;
  }

  // Also check if user is a collaborator (for SUPER_ADMIN, ADMIN, FACILITATOR)
  if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' || user.role === 'FACILITATOR') {
    const cohort = await models.Cohort.findOne({
      _id: cohortId,
      collaborators: {
        $elemMatch: {
          user: user._id,
          role: { $in: ['OWNER', 'AUTHOR'] }
        }
      }
    });
    if (cohort) return true;
  }

  throw { message: 'You do not have access to this cohort', statusCode: 401 };

}