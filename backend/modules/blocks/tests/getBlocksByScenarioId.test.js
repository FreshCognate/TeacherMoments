import { describe, it, expect, vi, beforeEach } from 'vitest';

const { checkAccessMock } = vi.hoisted(() => ({ checkAccessMock: vi.fn() }));

vi.mock('../../scenarios/helpers/checkHasAccessToScenario.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));

import getBlocksByScenarioId from '../services/getBlocksByScenarioId.js';

const buildModelChain = (blocks) => {
  const populate2 = vi.fn().mockResolvedValue(blocks);
  const populate1 = vi.fn(() => ({ populate: populate2 }));
  const sort = vi.fn(() => ({ populate: populate1 }));
  return {
    find: vi.fn(() => ({ sort }))
  };
};

describe('getBlocksByScenarioId', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('checks scenario access', async () => {
    const Block = buildModelChain([]);
    const ctx = { models: { Block } };
    await getBlocksByScenarioId({ scenarioId: 's1' }, {}, ctx);

    expect(checkAccessMock).toHaveBeenCalledWith({ modelId: 's1', modelType: 'Scenario' }, ctx);
  });

  it('searches with isDeleted=false by default', async () => {
    const Block = buildModelChain([]);
    await getBlocksByScenarioId({ scenarioId: 's1' }, {}, { models: { Block } });

    expect(Block.find).toHaveBeenCalledWith({ scenario: 's1', isDeleted: false });
  });

  it('honours an explicit isDeleted', async () => {
    const Block = buildModelChain([]);
    await getBlocksByScenarioId({ scenarioId: 's1' }, { isDeleted: true }, { models: { Block } });

    expect(Block.find).toHaveBeenCalledWith({ scenario: 's1', isDeleted: true });
  });

  it('returns blocks wrapped in an object', async () => {
    const Block = buildModelChain([{ _id: 'b1' }, { _id: 'b2' }]);
    const result = await getBlocksByScenarioId({ scenarioId: 's1' }, {}, { models: { Block } });

    expect(result).toEqual({ blocks: [{ _id: 'b1' }, { _id: 'b2' }] });
  });
});
