import checkHasAccessToCohort from '../helpers/checkHasAccessToCohort.js';
import getCohortCollaboratorsPopulate from '../helpers/getCohortCollaboratorsPopulate.js';

export default async (props, options, context) => {

  const { cohortId, update } = props;
  const { models } = context;

  await checkHasAccessToCohort({ cohortId }, context);

  const { path, select } = getCohortCollaboratorsPopulate();

  const cohort = await models.Cohort.findByIdAndUpdate(cohortId, update, { new: true }).populate(path, select);

  if (!cohort) throw { message: 'This cohort does not exist', statusCode: 404 };

  return cohort;

};