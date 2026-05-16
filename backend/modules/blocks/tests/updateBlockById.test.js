import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { checkAccessMock, setScenarioHasChangesMock } = vi.hoisted(() => ({
  checkAccessMock: vi.fn(),
  setScenarioHasChangesMock: vi.fn()
}));

vi.mock('../../scenarios/helpers/checkHasAccessToScenario.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));

vi.mock('../../scenarios/services/setScenarioHasChanges.js', () => ({
  default: (...args) => setScenarioHasChangesMock(...args)
}));

import updateBlockById from '../services/updateBlockById.js';

const FIXED_NOW = new Date('2026-05-06T12:00:00Z');

const buildModel = (block) => {
  const populate2 = vi.fn().mockResolvedValue(block);
  const populate1 = vi.fn(() => ({ populate: populate2 }));
  return { findByIdAndUpdate: vi.fn(() => ({ populate: populate1 })) };
};

describe('updateBlockById', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('checks scenario access via the block id', async () => {
    const Block = buildModel({ _id: 'b1', scenario: 's1' });
    const ctx = { models: { Block }, user: { _id: 'u1' } };

    await updateBlockById({ blockId: 'b1', update: { name: 'new' } }, {}, ctx);
    expect(checkAccessMock).toHaveBeenCalledWith({ modelId: 'b1', modelType: 'Block' }, ctx);
  });

  it('applies the update with updatedBy and updatedAt', async () => {
    const Block = buildModel({ _id: 'b1', scenario: 's1' });

    await updateBlockById(
      { blockId: 'b1', update: { name: 'new' } },
      {},
      { models: { Block }, user: { _id: 'u1' } }
    );

    expect(Block.findByIdAndUpdate).toHaveBeenCalledWith('b1', expect.objectContaining({
      name: 'new',
      updatedBy: 'u1',
      updatedAt: FIXED_NOW
    }), { new: true });
  });

  it('throws 404 when the block does not exist', async () => {
    const Block = buildModel(null);

    await expect(updateBlockById(
      { blockId: 'missing', update: {} },
      {},
      { models: { Block }, user: { _id: 'u1' } }
    )).rejects.toMatchObject({ statusCode: 404, message: 'This block does not exist' });
  });

  it('marks the scenario as having changes after a successful update', async () => {
    const Block = buildModel({ _id: 'b1', scenario: 's1' });
    const ctx = { models: { Block }, user: { _id: 'u1' } };

    await updateBlockById({ blockId: 'b1', update: { name: 'new' } }, {}, ctx);

    expect(setScenarioHasChangesMock).toHaveBeenCalledWith({ scenarioId: 's1' }, {}, ctx);
  });
});
