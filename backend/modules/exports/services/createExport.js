import createJob from '#core/queues/helpers/createJob.js';
import checkHasAccessToScenario from '../../scenarios/helpers/checkHasAccessToScenario.js';
import checkHasAccessToViewCohort from '../../cohorts/helpers/checkHasAccessToViewCohort.js';

export default async (props, options, context) => {

  const { exportType, scenarioId, cohortId, userId } = props;
  const { models, user } = context;

  if (exportType === 'SCENARIO_RESPONSES' && !scenarioId) {
    throw { message: 'scenarioId is required for this export type', statusCode: 400 };
  }
  if (exportType === 'COHORT_SCENARIO' && (!cohortId || !scenarioId)) {
    throw { message: 'cohortId and scenarioId are required', statusCode: 400 };
  }
  if (exportType === 'COHORT_USER' && (!cohortId || !userId)) {
    throw { message: 'cohortId and userId are required', statusCode: 400 };
  }
  if (exportType === 'COHORT_ALL' && !cohortId) {
    throw { message: 'cohortId is required', statusCode: 400 };
  }

  if (scenarioId) {
    await checkHasAccessToScenario({ modelId: scenarioId, modelType: 'Scenario' }, context);
  }

  if (cohortId) {
    await checkHasAccessToViewCohort({ cohortId }, context);
  }

  const existingExport = await models.Export.findOne({
    exportType,
    scenarioId: scenarioId || undefined,
    cohortId: cohortId || undefined,
    userId: userId || undefined,
    createdBy: user._id,
    status: { $in: ['PENDING', 'PROCESSING'] }
  }).lean();

  if (existingExport) {
    throw { message: 'An export is already in progress', statusCode: 409 };
  }

  const exportRecord = await models.Export.create({
    exportType,
    scenarioId,
    cohortId,
    userId,
    status: 'PENDING',
    createdBy: user._id
  });

  const job = await createJob({
    queue: 'exports',
    name: 'GENERATE_EXPORT',
    job: {
      exportId: String(exportRecord._id),
      exportType,
      scenarioId: scenarioId ? String(scenarioId) : undefined,
      cohortId: cohortId ? String(cohortId) : undefined,
      userId: userId ? String(userId) : undefined
    }
  });

  return { export: exportRecord, jobId: job.id };

};
