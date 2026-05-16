import { describe, it, expect, vi } from 'vitest';
import getScenarioSlidesAndBlocksByRef from '../helpers/getScenarioSlidesAndBlocksByRef.js';

const buildBlockChain = (blocks) => {
  const populate2 = vi.fn().mockResolvedValue(blocks);
  const populate1 = vi.fn(() => ({ populate: populate2 }));
  return { find: vi.fn(() => ({ populate: populate1 })) };
};

describe('getScenarioSlidesAndBlocksByRef', () => {
  it('queries non-deleted slides for the scenario', async () => {
    const Slide = { find: vi.fn().mockResolvedValue([]) };
    const Block = buildBlockChain([]);

    await getScenarioSlidesAndBlocksByRef({ scenarioId: 's1' }, { models: { Slide, Block } });

    expect(Slide.find).toHaveBeenCalledWith({ scenario: 's1', isDeleted: false });
    expect(Block.find).toHaveBeenCalledWith({ scenario: 's1', isDeleted: false });
  });

  it('returns slides keyed by ref', async () => {
    const slides = [{ ref: 'slide-a', name: 'A' }, { ref: 'slide-b', name: 'B' }];
    const Slide = { find: vi.fn().mockResolvedValue(slides) };
    const Block = buildBlockChain([]);

    const result = await getScenarioSlidesAndBlocksByRef({ scenarioId: 's1' }, { models: { Slide, Block } });

    expect(result.slidesByRef).toEqual({
      'slide-a': slides[0],
      'slide-b': slides[1]
    });
  });

  it('returns blocks keyed by ref', async () => {
    const blocks = [{ ref: 'block-a' }, { ref: 'block-b' }];
    const Slide = { find: vi.fn().mockResolvedValue([]) };
    const Block = buildBlockChain(blocks);

    const result = await getScenarioSlidesAndBlocksByRef({ scenarioId: 's1' }, { models: { Slide, Block } });

    expect(result.blocksByRef).toEqual({
      'block-a': blocks[0],
      'block-b': blocks[1]
    });
  });

  it('returns empty maps when nothing matches', async () => {
    const Slide = { find: vi.fn().mockResolvedValue([]) };
    const Block = buildBlockChain([]);

    const result = await getScenarioSlidesAndBlocksByRef({ scenarioId: 's1' }, { models: { Slide, Block } });

    expect(result).toEqual({ slidesByRef: {}, blocksByRef: {} });
  });
});
