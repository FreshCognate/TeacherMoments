import omit from 'lodash/omit.js';
import checkHasAccessToCohort from '../helpers/checkHasAccessToCohort.js';

export default async (props, options, context) => {

  const { cohortId } = props;
  const { models, user, connection } = context;

  await checkHasAccessToCohort({ cohortId }, context);

  const existingCohort = await models.Cohort.findById(cohortId);

  if (!existingCohort) throw { message: "This cohort does not exist", statusCode: 404 };

  let newCohort;

  await connection.transaction(async (session) => {

    const duplicatedCohortObject = omit(existingCohort, ['_id']);
    duplicatedCohortObject.name = duplicatedCohortObject.name + " - Duplicate";
    duplicatedCohortObject.originalCohort = existingCohort._id;
    duplicatedCohortObject.createdAt = new Date();
    duplicatedCohortObject.createdBy = user._id;

    const bulkCohorts = await models.Cohort.create([duplicatedCohortObject], { session });
    newCohort = bulkCohorts[0];

  }).catch(err => {
    console.log(err);
    throw { message: "Failed to duplicate cohort", statusCode: 500 };
  });

  return newCohort;

};