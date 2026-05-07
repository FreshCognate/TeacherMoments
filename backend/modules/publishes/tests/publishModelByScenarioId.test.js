import { describe, it, expect, vi } from 'vitest';
import publishModelByScenarioId from '../services/publishModelByScenarioId.js';

describe('publishModelByScenarioId', () => {
  it('clears the Published_<model> collection for the scenario', async () => {
    const Published_Slide = { deleteMany: vi.fn().mockResolvedValue({}), create: vi.fn() };
    const Slide = { find: vi.fn().mockResolvedValue([]) };

    await publishModelByScenarioId(
      { model: 'Slide', scenarioId: 's1' },
      {},
      { models: { Published_Slide, Slide } }
    );

    expect(Published_Slide.deleteMany).toHaveBeenCalledWith({ scenario: 's1' });
  });

  it('finds non-deleted draft documents for the scenario', async () => {
    const Published_Slide = { deleteMany: vi.fn().mockResolvedValue({}), create: vi.fn() };
    const Slide = { find: vi.fn().mockResolvedValue([]) };

    await publishModelByScenarioId(
      { model: 'Slide', scenarioId: 's1' },
      {},
      { models: { Published_Slide, Slide } }
    );

    expect(Slide.find).toHaveBeenCalledWith({ scenario: 's1', isDeleted: false });
  });

  it('creates a Published_<model> doc for each draft', async () => {
    const drafts = [
      { _id: 'd1', toJSON: () => ({ _id: 'd1', name: 'A' }) },
      { _id: 'd2', toJSON: () => ({ _id: 'd2', name: 'B' }) }
    ];
    const Published_Block = { deleteMany: vi.fn().mockResolvedValue({}), create: vi.fn().mockResolvedValue({}) };
    const Block = { find: vi.fn().mockResolvedValue(drafts) };

    await publishModelByScenarioId(
      { model: 'Block', scenarioId: 's1' },
      {},
      { models: { Published_Block, Block } }
    );

    expect(Published_Block.create).toHaveBeenCalledTimes(2);
    expect(Published_Block.create).toHaveBeenCalledWith({ _id: 'd1', name: 'A' });
    expect(Published_Block.create).toHaveBeenCalledWith({ _id: 'd2', name: 'B' });
  });

  it('uses the model name to look up Published_<model> dynamically', async () => {
    const Published_Trigger = { deleteMany: vi.fn().mockResolvedValue({}), create: vi.fn() };
    const Trigger = { find: vi.fn().mockResolvedValue([]) };

    await publishModelByScenarioId(
      { model: 'Trigger', scenarioId: 's1' },
      {},
      { models: { Published_Trigger, Trigger } }
    );

    expect(Published_Trigger.deleteMany).toHaveBeenCalled();
    expect(Trigger.find).toHaveBeenCalled();
  });
});
