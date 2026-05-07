import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { getSocketsMock } = vi.hoisted(() => ({ getSocketsMock: vi.fn() }));

vi.mock('#core/io/index.js', () => ({
  getSockets: () => getSocketsMock()
}));

import setScenarioHasChanges from '../services/setScenarioHasChanges.js';

const FIXED_NOW = new Date('2026-05-07T12:00:00Z');

describe('setScenarioHasChanges', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('sets hasChanges=true with timestamp and actor', async () => {
    const findByIdAndUpdate = vi.fn().mockResolvedValue({});
    const sockets = { emit: vi.fn() };
    getSocketsMock.mockReturnValue(sockets);

    await setScenarioHasChanges(
      { scenarioId: 's1' },
      {},
      { models: { Scenario: { findByIdAndUpdate } }, user: { _id: 'u1' } }
    );

    expect(findByIdAndUpdate).toHaveBeenCalledWith('s1', {
      hasChanges: true,
      updatedAt: FIXED_NOW,
      updatedBy: 'u1'
    });
  });

  it('emits a SCENARIO_HAS_CHANGED event over the sockets channel keyed by scenario', async () => {
    const findByIdAndUpdate = vi.fn().mockResolvedValue({});
    const sockets = { emit: vi.fn() };
    getSocketsMock.mockReturnValue(sockets);

    await setScenarioHasChanges(
      { scenarioId: 's1' },
      {},
      { models: { Scenario: { findByIdAndUpdate } }, user: { _id: 'u1' } }
    );

    expect(sockets.emit).toHaveBeenCalledWith('SCENARIO:s1_EVENT:SCENARIO_HAS_CHANGED', {});
  });
});
