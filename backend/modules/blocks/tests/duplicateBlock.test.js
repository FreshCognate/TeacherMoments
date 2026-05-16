import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { checkAccessMock } = vi.hoisted(() => ({ checkAccessMock: vi.fn() }));

vi.mock('../../scenarios/helpers/checkHasAccessToScenario.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));

import duplicateBlock from '../services/duplicateBlock.js';

const FIXED_NOW = new Date('2026-05-06T12:00:00Z');

describe('duplicateBlock', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('checks scenario access via the source block id', async () => {
    const sourceBlock = { ref: 'block-ref-1', scenario: 's1', slideRef: 'slide-1', blockType: 'TEXT' };
    const models = {
      Block: {
        findById: vi.fn().mockResolvedValue(sourceBlock),
        create: vi.fn().mockResolvedValue([{}])
      }
    };
    const ctx = { models, session: 'tx-1' };

    await duplicateBlock({ blockId: 'b1', newScenarioId: 's2', newSlideRef: 'slide-2' }, ctx);

    expect(checkAccessMock).toHaveBeenCalledWith({ modelId: 'b1', modelType: 'Block' }, ctx);
  });

  it('creates a new block with original-* pointers and the new scenario/slideRef', async () => {
    const sourceBlock = {
      _id: 'b1',
      ref: 'block-ref-1',
      scenario: 's1',
      slideRef: 'slide-1',
      blockType: 'TEXT'
    };
    const models = {
      Block: {
        findById: vi.fn().mockResolvedValue(sourceBlock),
        create: vi.fn().mockResolvedValue([{}])
      }
    };

    await duplicateBlock(
      { blockId: 'b1', newScenarioId: 's2', newSlideRef: 'slide-2' },
      { models, session: 'tx-1' }
    );

    const [docs, options] = models.Block.create.mock.calls[0];
    expect(docs[0]).toMatchObject({
      scenario: 's2',
      slideRef: 'slide-2',
      originalRef: 'block-ref-1',
      originalSlideRef: 'slide-1',
      originalScenario: 's1',
      blockType: 'TEXT',
      createdAt: FIXED_NOW
    });
    expect(docs[0]._id).toBeUndefined();
    expect(docs[0].ref).toBeUndefined();
    expect(options).toEqual({ session: 'tx-1' });
  });
});
