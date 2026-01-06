import checkHasAccessToEditCohort from '../helpers/checkHasAccessToEditCohort.js';
import getCohortCollaboratorsPopulate from '../helpers/getCohortCollaboratorsPopulate.js';

export default async (props, options, context) => {

  const { cohortId, update } = props;
  const { models, user } = context;

  await checkHasAccessToEditCohort({ cohortId }, context);

  const { path, select } = getCohortCollaboratorsPopulate();

  update.updatedBy = user._id;
  update.updatedAt = new Date();

  const cohort = await models.Cohort.findByIdAndUpdate(cohortId, update, { new: true }).populate(path, select);

  if (!cohort) throw { message: 'This cohort does not exist', statusCode: 404 };

  return cohort;

};