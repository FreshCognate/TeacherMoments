import { describe, it, expect, vi, beforeEach } from 'vitest';

const { checkAccessMock } = vi.hoisted(() => ({ checkAccessMock: vi.fn() }));

vi.mock('../../scenarios/helpers/checkHasAccessToScenario.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));

import getBlocksByScenarioIdAndSlideRef from '../services/getBlocksByScenarioIdAndSlideRef.js';

const buildModelChain = (blocks) => {
  const populate2 = vi.fn().mockResolvedValue(blocks);
  const populate1 = vi.fn(() => ({ populate: populate2 }));
  const sort = vi.fn(() => ({ populate: populate1 }));
  return {
    find: vi.fn(() => ({ sort }))
  };
};

describe('getBlocksByScenarioIdAndSlideRef', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('checks scenario access', async () => {
    const Block = buildModelChain([]);
    const ctx = { models: { Block } };

    await getBlocksByScenarioIdAndSlideRef({ scenarioId: 's1', slideRef: 'slide-1' }, {}, ctx);
    expect(checkAccessMock).toHaveBeenCalledWith({ modelId: 's1', modelType: 'Scenario' }, ctx);
  });

  it('searches by scenario + slideRef + isDeleted', async () => {
    const Block = buildModelChain([]);

    await getBlocksByScenarioIdAndSlideRef(
      { scenarioId: 's1', slideRef: 'slide-1' },
      { isDeleted: false },
      { models: { Block } }
    );

    expect(Block.find).toHaveBeenCalledWith({ scenario: 's1', slideRef: 'slide-1', isDeleted: false });
  });

  it('returns blocks wrapped in an object', async () => {
    const Block = buildModelChain([{ _id: 'b1' }]);

    const result = await getBlocksByScenarioIdAndSlideRef(
      { scenarioId: 's1', slideRef: 'slide-1' },
      {},
      { models: { Block } }
    );

    expect(result).toEqual({ blocks: [{ _id: 'b1' }] });
  });
});
