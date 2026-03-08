import checkHasAccessToEditCohort from '../../cohorts/helpers/checkHasAccessToEditCohort.js';
import createJob from '#core/queues/helpers/createJob.js';

export default async function createBlockResponsesSummary({ cohortId, scenarioId, blockRef }, context) {

  const { user } = context;

  await checkHasAccessToEditCohort({ cohortId }, context);

  const job = await createJob({
    queue: 'generate',
    name: 'BLOCK_RESPONSES_SUMMARY',
    job: {
      payload: {
        cohortId,
        scenarioId,
        blockRef
      },
      createdBy: user._id,
      createdAt: new Date()
    }
  });

  return { jobId: job.id };

}
