import { describe, it, expect, vi, beforeEach } from 'vitest';

const { checkCohortEditMock, checkScenarioAccessMock, createJobMock } = vi.hoisted(() => ({
  checkCohortEditMock: vi.fn(),
  checkScenarioAccessMock: vi.fn(),
  createJobMock: vi.fn()
}));

vi.mock('../../cohorts/helpers/checkHasAccessToEditCohort.js', () => ({ default: (...args) => checkCohortEditMock(...args) }));
vi.mock('../../scenarios/helpers/checkHasAccessToScenario.js', () => ({ default: (...args) => checkScenarioAccessMock(...args) }));
vi.mock('#core/queues/helpers/createJob.js', () => ({ default: (...args) => createJobMock(...args) }));

import createSlideResponsesSummary from '../services/createSlideResponsesSummary.js';

describe('createSlideResponsesSummary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createJobMock.mockResolvedValue({ id: 'job-1' });
  });

  it('checks cohort edit access when cohortId is provided', async () => {
    await createSlideResponsesSummary(
      { cohortId: 'c1', scenarioId: 's1', slideRef: 'slide-1' },
      { user: { _id: 'u1' } }
    );
    expect(checkCohortEditMock).toHaveBeenCalled();
    expect(checkScenarioAccessMock).not.toHaveBeenCalled();
  });

  it('checks scenario access when only scenarioId is provided', async () => {
    await createSlideResponsesSummary(
      { scenarioId: 's1', slideRef: 'slide-1' },
      { user: { _id: 'u1' } }
    );
    expect(checkScenarioAccessMock).toHaveBeenCalled();
    expect(checkCohortEditMock).not.toHaveBeenCalled();
  });

  it('queues a SLIDE_RESPONSES_SUMMARY job carrying cohortId, scenarioId and slideRef', async () => {
    await createSlideResponsesSummary(
      { cohortId: 'c1', scenarioId: 's1', slideRef: 'slide-1' },
      { user: { _id: 'u1' } }
    );

    expect(createJobMock).toHaveBeenCalledWith({
      queue: 'generate',
      name: 'SLIDE_RESPONSES_SUMMARY',
      job: expect.objectContaining({
        payload: { cohortId: 'c1', scenarioId: 's1', slideRef: 'slide-1' },
        createdBy: 'u1'
      })
    });
  });

  it('returns the job id', async () => {
    createJobMock.mockResolvedValue({ id: 'job-99' });
    const result = await createSlideResponsesSummary({ scenarioId: 's1', slideRef: 'slide-1' }, { user: { _id: 'u1' } });
    expect(result).toEqual({ jobId: 'job-99' });
  });
});
