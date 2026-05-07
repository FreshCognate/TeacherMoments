import { describe, it, expect, vi, beforeEach } from 'vitest';

const { checkCohortEditMock, checkScenarioAccessMock, createJobMock } = vi.hoisted(() => ({
  checkCohortEditMock: vi.fn(),
  checkScenarioAccessMock: vi.fn(),
  createJobMock: vi.fn()
}));

vi.mock('../../cohorts/helpers/checkHasAccessToEditCohort.js', () => ({ default: (...args) => checkCohortEditMock(...args) }));
vi.mock('../../scenarios/helpers/checkHasAccessToScenario.js', () => ({ default: (...args) => checkScenarioAccessMock(...args) }));
vi.mock('#core/queues/helpers/createJob.js', () => ({ default: (...args) => createJobMock(...args) }));

import createScenarioResponsesSummary from '../services/createScenarioResponsesSummary.js';

describe('createScenarioResponsesSummary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createJobMock.mockResolvedValue({ id: 'job-1' });
  });

  it('checks cohort edit access when cohortId is provided', async () => {
    const ctx = { user: { _id: 'u1' } };

    await createScenarioResponsesSummary({ cohortId: 'c1', scenarioId: 's1' }, ctx);

    expect(checkCohortEditMock).toHaveBeenCalledWith({ cohortId: 'c1' }, ctx);
    expect(checkScenarioAccessMock).not.toHaveBeenCalled();
  });

  it('checks scenario access when only scenarioId is provided', async () => {
    const ctx = { user: { _id: 'u1' } };

    await createScenarioResponsesSummary({ scenarioId: 's1' }, ctx);

    expect(checkScenarioAccessMock).toHaveBeenCalledWith({ modelId: 's1', modelType: 'Scenario' }, ctx);
    expect(checkCohortEditMock).not.toHaveBeenCalled();
  });

  it('queues a SCENARIO_RESPONSES_SUMMARY job in the generate queue with cohortId+scenarioId', async () => {
    await createScenarioResponsesSummary({ cohortId: 'c1', scenarioId: 's1' }, { user: { _id: 'u1' } });

    expect(createJobMock).toHaveBeenCalledWith({
      queue: 'generate',
      name: 'SCENARIO_RESPONSES_SUMMARY',
      job: expect.objectContaining({
        payload: { cohortId: 'c1', scenarioId: 's1' },
        createdBy: 'u1'
      })
    });
  });

  it('returns the job id', async () => {
    createJobMock.mockResolvedValue({ id: 'job-42' });
    const result = await createScenarioResponsesSummary({ scenarioId: 's1' }, { user: { _id: 'u1' } });
    expect(result).toEqual({ jobId: 'job-42' });
  });
});
