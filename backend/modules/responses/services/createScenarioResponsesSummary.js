import checkHasAccessToEditCohort from '../../cohorts/helpers/checkHasAccessToEditCohort.js';
import checkHasAccessToScenario from '../../scenarios/helpers/checkHasAccessToScenario.js';
import createJob from '#core/queues/helpers/createJob.js';

export default async function createScenarioResponsesSummary({ cohortId, scenarioId }, context) {

  const { user } = context;

  if (cohortId) {
    await checkHasAccessToEditCohort({ cohortId }, context);
  } else {
    await checkHasAccessToScenario({ modelId: scenarioId, modelType: 'Scenario' }, context);
  }

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
