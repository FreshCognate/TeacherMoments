import checkHasAccessToEditCohort from '../../cohorts/helpers/checkHasAccessToEditCohort.js';
import createJob from '#core/queues/helpers/createJob.js';

export default async function createScenarioResponsesSummary({ cohortId, scenarioId }, context) {

  const { user } = context;

  await checkHasAccessToEditCohort({ cohortId }, context);

  const job = await createJob({
    queue: 'generate',
    name: 'SCENARIO_RESPONSES_SUMMARY',
    job: {
      payload: {
        cohortId,
        scenarioId
      },
      createdBy: user._id,
      createdAt: new Date()
    }
  });

  return { jobId: job.id };

}
