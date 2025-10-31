import checkHasAccessToCohort from '../helpers/checkHasAccessToCohort.js';
import getCohortCollaboratorsPopulate from "../helpers/getCohortCollaboratorsPopulate.js";

export default async (props, options, context) => {

  const { cohortId } = props;
  const { models } = context;

  await checkHasAccessToCohort({ cohortId }, context);

  const { path, select } = getCohortCollaboratorsPopulate();

  const cohort = await models.Cohort.findById(cohortId).populate(path, select);

  if (!cohort) throw { message: 'This cohort does not exist', statusCode: 404 };

  return cohort;

};