export default async ({ cohortId }, { user, models }) => {

  if (!cohortId) {
    throw { message: 'You do not have access to this cohort', statusCode: 401 };
  }

  const cohortUser = await models.User.findOne({
    _id: user._id,
    'cohorts.cohort': cohortId
  })

  if (cohortUser) {
    return true;
  }

  throw { message: 'You do not have access to this cohort', statusCode: 401 };

}