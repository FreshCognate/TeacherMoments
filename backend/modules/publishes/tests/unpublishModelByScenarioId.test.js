import { describe, it, expect, vi } from 'vitest';
import unpublishModelByScenarioId from '../services/unpublishModelByScenarioId.js';

describe('unpublishModelByScenarioId', () => {
  it('deletes all Published_<model> docs for the scenario', async () => {
    const Published_Slide = { deleteMany: vi.fn().mockResolvedValue({}) };

    await unpublishModelByScenarioId(
      { model: 'Slide', scenarioId: 's1' },
      {},
      { models: { Published_Slide } }
    );

    expect(Published_Slide.deleteMany).toHaveBeenCalledWith({ scenario: 's1' });
  });

  it('uses the model name to look up Published_<model> dynamically', async () => {
    const Published_Block = { deleteMany: vi.fn().mockResolvedValue({}) };
    await unpublishModelByScenarioId(
      { model: 'Block', scenarioId: 's1' },
      {},
      { models: { Published_Block } }
    );
    expect(Published_Block.deleteMany).toHaveBeenCalled();
  });
});
