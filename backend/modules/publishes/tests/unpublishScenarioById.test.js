import { describe, it, expect, vi, beforeEach } from 'vitest';

const { unpublishModelByScenarioIdMock } = vi.hoisted(() => ({ unpublishModelByScenarioIdMock: vi.fn() }));

vi.mock('../services/unpublishModelByScenarioId.js', () => ({
  default: (...args) => unpublishModelByScenarioIdMock(...args)
}));

import unpublishScenarioById from '../services/unpublishScenarioById.js';

const buildScenario = (overrides = {}) => ({
  _id: 's1',
  isPublished: true,
  publishedAt: new Date(),
  publishedBy: 'u-author',
  hasChanges: false,
  save: vi.fn().mockResolvedValue(),
  ...overrides
});

describe('unpublishScenarioById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('throws 404 when the scenario does not exist', async () => {
    const models = {
      Scenario: { findById: vi.fn().mockResolvedValue(null) },
      Published_Scenario: { deleteOne: vi.fn() }
    };

    await expect(unpublishScenarioById(
      { scenarioId: 'missing' },
      {},
      { models, user: { _id: 'u1' } }
    )).rejects.toMatchObject({ statusCode: 404 });
  });

  it('throws 400 when the scenario is not currently published', async () => {
    const scenario = buildScenario({ isPublished: false });
    const models = {
      Scenario: { findById: vi.fn().mockResolvedValue(scenario) },
      Published_Scenario: { deleteOne: vi.fn() }
    };

    await expect(unpublishScenarioById(
      { scenarioId: 's1' },
      {},
      { models, user: { _id: 'u1' } }
    )).rejects.toMatchObject({ statusCode: 400 });
  });

  it('unpublishes Slide, Block, and Trigger models for the scenario', async () => {
    const scenario = buildScenario();
    const models = {
      Scenario: { findById: vi.fn().mockResolvedValue(scenario) },
      Published_Scenario: { deleteOne: vi.fn().mockResolvedValue({}) }
    };
    const ctx = { models, user: { _id: 'u1' } };

    await unpublishScenarioById({ scenarioId: 's1' }, {}, ctx);

    expect(unpublishModelByScenarioIdMock).toHaveBeenCalledWith({ model: 'Slide', scenarioId: 's1' }, {}, ctx);
    expect(unpublishModelByScenarioIdMock).toHaveBeenCalledWith({ model: 'Block', scenarioId: 's1' }, {}, ctx);
    expect(unpublishModelByScenarioIdMock).toHaveBeenCalledWith({ model: 'Trigger', scenarioId: 's1' }, {}, ctx);
  });

  it('deletes the Published_Scenario doc', async () => {
    const scenario = buildScenario();
    const models = {
      Scenario: { findById: vi.fn().mockResolvedValue(scenario) },
      Published_Scenario: { deleteOne: vi.fn().mockResolvedValue({}) }
    };

    await unpublishScenarioById({ scenarioId: 's1' }, {}, { models, user: { _id: 'u1' } });

    expect(models.Published_Scenario.deleteOne).toHaveBeenCalledWith({ _id: 's1' });
  });

  it('clears publish flags and marks hasChanges', async () => {
    const scenario = buildScenario();
    const models = {
      Scenario: { findById: vi.fn().mockResolvedValue(scenario) },
      Published_Scenario: { deleteOne: vi.fn().mockResolvedValue({}) }
    };

    await unpublishScenarioById({ scenarioId: 's1' }, {}, { models, user: { _id: 'u1' } });

    expect(scenario.hasChanges).toBe(true);
    expect(scenario.isPublished).toBe(false);
    expect(scenario.publishedAt).toBeNull();
    expect(scenario.publishedBy).toBeNull();
    expect(scenario.save).toHaveBeenCalled();
  });

  it('returns the updated scenario', async () => {
    const scenario = buildScenario();
    const models = {
      Scenario: { findById: vi.fn().mockResolvedValue(scenario) },
      Published_Scenario: { deleteOne: vi.fn().mockResolvedValue({}) }
    };

    const result = await unpublishScenarioById({ scenarioId: 's1' }, {}, { models, user: { _id: 'u1' } });

    expect(result).toBe(scenario);
  });
});
