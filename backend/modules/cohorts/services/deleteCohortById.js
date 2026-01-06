import checkHasAccessToEditCohort from '../helpers/checkHasAccessToEditCohort.js';

export default async (props, options, context) => {

  const { cohortId } = props;
  const { models, user } = context;

  await checkHasAccessToEditCohort({ cohortId }, context);

  const cohort = await models.Cohort.findByIdAndUpdate(cohortId, {
    isDeleted: true,
    deletedAt: new Date(),
    deletedBy: user._id
  }, { new: true });

  if (!cohort) throw { message: 'This cohort does not exist', statusCode: 404 };

  return cohort;

};