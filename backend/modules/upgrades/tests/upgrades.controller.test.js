import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { createJobMock } = vi.hoisted(() => ({ createJobMock: vi.fn() }));
vi.mock('#core/queues/helpers/createJob.js', () => ({
  default: (...args) => createJobMock(...args)
}));

import controller from '../upgrades.controller.js';

const FIXED_NOW = new Date('2026-05-08T12:00:00Z');

describe('upgrades.controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('queues an upgrade job named after the URL param and returns the job id', async () => {
    createJobMock.mockResolvedValue({ id: 'job1' });

    const result = await controller.read(
      { param: 'addMissingTagPriorities' },
      { user: { _id: 'u1' } }
    );

    expect(createJobMock).toHaveBeenCalledWith({
      queue: 'upgrades',
      name: 'addMissingTagPriorities',
      job: {
        createdBy: 'u1',
        createdAt: FIXED_NOW
      }
    });
    expect(result).toEqual({ jobId: 'job1' });
  });
});
