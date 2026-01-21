export default async ({ cohortId }, { user, models }) => {

  if (!cohortId) {
    throw { message: 'You do not have access to this cohort', statusCode: 401 };
  }

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
  } else {
    const cohortUser = await models.User.findOne({
      _id: user._id,
      'cohorts.cohort': cohortId
    })

    if (cohortUser) {
      return true;
    }
  }

  throw { message: 'You do not have access to this cohort', statusCode: 401 };

}