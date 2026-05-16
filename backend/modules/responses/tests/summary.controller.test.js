import { describe, it, expect, vi, beforeEach } from 'vitest';

const { createSlideMock, createScenarioMock, createUserMock } = vi.hoisted(() => ({
  createSlideMock: vi.fn(),
  createScenarioMock: vi.fn(),
  createUserMock: vi.fn()
}));

vi.mock('../services/createSlideResponsesSummary.js', () => ({ default: (...args) => createSlideMock(...args) }));
vi.mock('../services/createScenarioResponsesSummary.js', () => ({ default: (...args) => createScenarioMock(...args) }));
vi.mock('../services/createUserResponsesSummary.js', () => ({ default: (...args) => createUserMock(...args) }));

import controller from '../summary.controller.js';

describe('summary.controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('routes to createUserResponsesSummary when body has userId', async () => {
    createUserMock.mockResolvedValue({ jobId: 'u-job' });

    const result = await controller.create(
      { body: { userId: 'u-target', cohortId: 'c1', scenarioId: 's1' } },
      { ctx: 1 }
    );

    expect(createUserMock).toHaveBeenCalledWith(
      { userId: 'u-target', cohortId: 'c1', scenarioId: 's1' },
      { ctx: 1 }
    );
    expect(createSlideMock).not.toHaveBeenCalled();
    expect(createScenarioMock).not.toHaveBeenCalled();
    expect(result).toEqual({ jobId: 'u-job' });
  });

  it('routes to createSlideResponsesSummary when body has slideRef but no userId', async () => {
    createSlideMock.mockResolvedValue({ jobId: 's-job' });

    const result = await controller.create(
      { body: { slideRef: 'slide-1', scenarioId: 's1' } },
      { ctx: 1 }
    );

    expect(createSlideMock).toHaveBeenCalled();
    expect(createScenarioMock).not.toHaveBeenCalled();
    expect(result).toEqual({ jobId: 's-job' });
  });

  it('routes to createScenarioResponsesSummary otherwise', async () => {
    createScenarioMock.mockResolvedValue({ jobId: 'sc-job' });

    const result = await controller.create({ body: { scenarioId: 's1' } }, { ctx: 1 });

    expect(createScenarioMock).toHaveBeenCalledWith({ scenarioId: 's1' }, { ctx: 1 });
    expect(result).toEqual({ jobId: 'sc-job' });
  });
});
