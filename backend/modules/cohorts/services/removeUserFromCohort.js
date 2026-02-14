import checkHasAccessToEditCohort from '../helpers/checkHasAccessToEditCohort.js';

export default async (props, options, context) => {

  const { userId, cohortId } = props;
  const { models } = context;

  await checkHasAccessToEditCohort({ cohortId }, context);

  const updatedUser = await models.User.findByIdAndUpdate(userId, {
    $pull: { cohorts: { cohort: cohortId } }
  }, { new: true });

  if (!updatedUser) throw { message: 'This user does not exist', statusCode: 404 };

  return updatedUser;

};
