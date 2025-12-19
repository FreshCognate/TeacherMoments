export default async (props, options, context) => {

  const { cohortId } = props;
  const { models, user } = context;

  const addedAt = new Date();

  const userCohort = {
    cohort: cohortId,
    addedAt: addedAt
  };

  const updatedUser = await models.User.findOneAndUpdate({
    _id: user._id,
    'cohorts.cohort': { $ne: cohortId }
  }, {
    $push: {
      cohorts: userCohort
    }
  }, { new: true });

  if (!updatedUser) {
    const existingUser = await models.User.findOne({
      'cohorts.cohort': cohortId
    })
    if (!existingUser) throw { message: 'This user does not exist', statusCode: 404 };
    return existingUser;
  }

  return updatedUser;

};