import { describe, it, expect, vi, beforeEach } from 'vitest';

const { checkCohortEditMock, checkScenarioAccessMock, createJobMock } = vi.hoisted(() => ({
  checkCohortEditMock: vi.fn(),
  checkScenarioAccessMock: vi.fn(),
  createJobMock: vi.fn()
}));

vi.mock('../../cohorts/helpers/checkHasAccessToEditCohort.js', () => ({ default: (...args) => checkCohortEditMock(...args) }));
vi.mock('../../scenarios/helpers/checkHasAccessToScenario.js', () => ({ default: (...args) => checkScenarioAccessMock(...args) }));
vi.mock('#core/queues/helpers/createJob.js', () => ({ default: (...args) => createJobMock(...args) }));

import createUserResponsesSummary from '../services/createUserResponsesSummary.js';

describe('createUserResponsesSummary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createJobMock.mockResolvedValue({ id: 'job-1' });
  });

  it('checks cohort edit access when cohortId is provided', async () => {
    await createUserResponsesSummary(
      { cohortId: 'c1', scenarioId: 's1', userId: 'u-target' },
      { user: { _id: 'u1' } }
    );
    expect(checkCohortEditMock).toHaveBeenCalled();
    expect(checkScenarioAccessMock).not.toHaveBeenCalled();
  });

  it('checks scenario access when only scenarioId is provided', async () => {
    await createUserResponsesSummary(
      { scenarioId: 's1', userId: 'u-target' },
      { user: { _id: 'u1' } }
    );
    expect(checkScenarioAccessMock).toHaveBeenCalled();
    expect(checkCohortEditMock).not.toHaveBeenCalled();
  });

  it('queues a USER_RESPONSES_SUMMARY job carrying cohortId, scenarioId and userId', async () => {
    await createUserResponsesSummary(
      { cohortId: 'c1', scenarioId: 's1', userId: 'u-target' },
      { user: { _id: 'u1' } }
    );

    expect(createJobMock).toHaveBeenCalledWith({
      queue: 'generate',
      name: 'USER_RESPONSES_SUMMARY',
      job: expect.objectContaining({
        payload: { cohortId: 'c1', scenarioId: 's1', userId: 'u-target' },
        createdBy: 'u1'
      })
    });
  });

  it('returns the job id', async () => {
    createJobMock.mockResolvedValue({ id: 'job-77' });
    const result = await createUserResponsesSummary({ scenarioId: 's1', userId: 'u-target' }, { user: { _id: 'u1' } });
    expect(result).toEqual({ jobId: 'job-77' });
  });
});
