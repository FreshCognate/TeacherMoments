import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import archiveUsersRunByScenarioId from '../services/archiveUsersRunByScenarioId.js';

const FIXED_NOW = new Date('2026-05-07T12:00:00Z');

describe('archiveUsersRunByScenarioId', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('archives all non-deleted, non-archived runs for the user+scenario', async () => {
    const updateMany = vi.fn().mockResolvedValue({ modifiedCount: 2 });

    await archiveUsersRunByScenarioId(
      { scenarioId: 's1' },
      {},
      { models: { Run: { updateMany } }, user: { _id: 'u1' } }
    );

    expect(updateMany).toHaveBeenCalledWith(
      { scenario: 's1', user: 'u1', isDeleted: false, isArchived: false },
      { isArchived: true, archivedAt: FIXED_NOW }
    );
  });

  it('returns the archived count and timestamp', async () => {
    const updateMany = vi.fn().mockResolvedValue({ modifiedCount: 3 });

    const result = await archiveUsersRunByScenarioId(
      { scenarioId: 's1' },
      {},
      { models: { Run: { updateMany } }, user: { _id: 'u1' } }
    );

    expect(result).toEqual({ archivedCount: 3, archivedAt: FIXED_NOW });
  });
});
