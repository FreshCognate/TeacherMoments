import checkHasAccessToEditCohort from '../helpers/checkHasAccessToEditCohort.js';
import getCohortCollaboratorsPopulate from "../helpers/getCohortCollaboratorsPopulate.js";

export default async (props, options, context) => {

  const { cohortId } = props;
  const { models, user } = context;

  await checkHasAccessToEditCohort({ cohortId }, context);

  const update = {
    isArchived: false,
    archivedAt: null,
    archivedBy: null,
    updatedAt: new Date(),
    updatedBy: user._id
  }

  const { path, select } = getCohortCollaboratorsPopulate();

  const cohort = await models.Cohort.findByIdAndUpdate(cohortId, update, { new: true }).populate(path, select);

  if (!cohort) throw { message: 'This cohort does not exist', statusCode: 404 };

  return cohort;

};