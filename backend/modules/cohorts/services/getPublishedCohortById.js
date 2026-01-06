import checkHasAccessToViewCohort from '../helpers/checkHasAccessToViewCohort.js';

export default async (props, options, context) => {

  const { cohortId } = props;
  const { models } = context;

  await checkHasAccessToViewCohort({ cohortId }, context);

  const cohort = await models.Cohort.findById(cohortId);

  if (!cohort) throw { message: 'This cohort does not exist', statusCode: 404 };

  return cohort;

};