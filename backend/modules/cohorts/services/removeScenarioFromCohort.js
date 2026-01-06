import checkHasAccessToEditCohort from '../helpers/checkHasAccessToEditCohort.js';
import getCohortCollaboratorsPopulate from '../helpers/getCohortCollaboratorsPopulate.js';

export default async (props, options, context) => {

  const { cohortId, update } = props;
  const { models, user } = context;

  await checkHasAccessToEditCohort({ cohortId }, context);

  const { path, select } = getCohortCollaboratorsPopulate();

  const updatedBy = user._id;
  const updatedAt = new Date();

  const { scenarioId } = update;

  const updatedScenario = await models.Scenario.findByIdAndUpdate(scenarioId, { $pull: { cohorts: { cohort: cohortId } } }, { new: true });

  if (!updatedScenario) throw { message: 'This scenario does not exist', statusCode: 404 };

  const cohortUpdate = {
    updatedBy,
    updatedAt
  };

  const cohort = await models.Cohort.findByIdAndUpdate(cohortId, cohortUpdate, { new: true }).populate(path, select);

  if (!cohort) throw { message: 'This cohort does not exist or already has this scenario added', statusCode: 404 };

  return cohort;

};