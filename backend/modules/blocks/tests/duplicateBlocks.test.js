import { describe, it, expect, vi, beforeEach } from 'vitest';

const { duplicateBlockMock } = vi.hoisted(() => ({ duplicateBlockMock: vi.fn() }));

vi.mock('../services/duplicateBlock.js', () => ({
  default: (...args) => duplicateBlockMock(...args)
}));

import duplicateBlocks from '../services/duplicateBlocks.js';

describe('duplicateBlocks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    duplicateBlockMock.mockResolvedValue({});
  });

  it('finds non-deleted blocks for the source scenario+slide', async () => {
    const find = vi.fn().mockResolvedValue([]);
    await duplicateBlocks(
      { scenarioId: 's1', slideRef: 'slide-1', newScenarioId: 's2', newSlideRef: 'slide-2' },
      { models: { Block: { find } }, session: 'tx-1' }
    );

    expect(find).toHaveBeenCalledWith({ scenario: 's1', slideRef: 'slide-1', isDeleted: false });
  });

  it('calls duplicateBlock for each block with the new scenario/slide', async () => {
    const find = vi.fn().mockResolvedValue([{ _id: 'b1' }, { _id: 'b2' }]);
    const ctx = { models: { Block: { find } }, session: 'tx-1' };

    await duplicateBlocks(
      { scenarioId: 's1', slideRef: 'slide-1', newScenarioId: 's2', newSlideRef: 'slide-2' },
      ctx
    );

    expect(duplicateBlockMock).toHaveBeenCalledTimes(2);
    expect(duplicateBlockMock).toHaveBeenCalledWith({ blockId: 'b1', newScenarioId: 's2', newSlideRef: 'slide-2' }, ctx);
    expect(duplicateBlockMock).toHaveBeenCalledWith({ blockId: 'b2', newScenarioId: 's2', newSlideRef: 'slide-2' }, ctx);
  });

  it('does nothing when there are no source blocks', async () => {
    const find = vi.fn().mockResolvedValue([]);
    await duplicateBlocks(
      { scenarioId: 's1', slideRef: 'slide-1', newScenarioId: 's2', newSlideRef: 'slide-2' },
      { models: { Block: { find } } }
    );
    expect(duplicateBlockMock).not.toHaveBeenCalled();
  });
});
