import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { getPublishLinkMock, publishModelByScenarioIdMock } = vi.hoisted(() => ({
  getPublishLinkMock: vi.fn(),
  publishModelByScenarioIdMock: vi.fn()
}));

vi.mock('../helpers/getPublishLink.js', () => ({ default: (...args) => getPublishLinkMock(...args) }));
vi.mock('../services/publishModelByScenarioId.js', () => ({ default: (...args) => publishModelByScenarioIdMock(...args) }));

import publishScenarioById from '../services/publishScenarioById.js';

const FIXED_NOW = new Date('2026-05-07T12:00:00Z');

const buildScenario = (overrides = {}) => {
  const scenario = {
    _id: 's1',
    name: 'Spring Scenario',
    publishLink: null,
    save: vi.fn().mockResolvedValue(),
    toJSON: vi.fn(function () { return { _id: this._id, name: this.name, publishLink: this.publishLink }; }),
    ...overrides
  };
  return scenario;
};

describe('publishScenarioById', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('throws 404 when the scenario does not exist', async () => {
    const models = {
      Scenario: { findById: vi.fn().mockResolvedValue(null) },
      Published_Scenario: { deleteOne: vi.fn(), create: vi.fn() }
    };

    await expect(publishScenarioById(
      { scenarioId: 'missing' },
      {},
      { models, user: { _id: 'u1' } }
    )).rejects.toMatchObject({ statusCode: 404 });
  });

  it('publishes Slide, Block, and Trigger models for the scenario', async () => {
    const scenario = buildScenario();
    const models = {
      Scenario: { findById: vi.fn().mockResolvedValue(scenario) },
      Published_Scenario: { deleteOne: vi.fn().mockResolvedValue({}), create: vi.fn().mockResolvedValue({}) }
    };
    const ctx = { models, user: { _id: 'u1' } };
    getPublishLinkMock.mockResolvedValue('spring-scenario');

    await publishScenarioById({ scenarioId: 's1' }, {}, ctx);

    expect(publishModelByScenarioIdMock).toHaveBeenCalledWith({ model: 'Slide', scenarioId: 's1' }, {}, ctx);
    expect(publishModelByScenarioIdMock).toHaveBeenCalledWith({ model: 'Block', scenarioId: 's1' }, {}, ctx);
    expect(publishModelByScenarioIdMock).toHaveBeenCalledWith({ model: 'Trigger', scenarioId: 's1' }, {}, ctx);
  });

  it('marks the scenario as published with timestamp and actor and clears hasChanges', async () => {
    const scenario = buildScenario();
    const models = {
      Scenario: { findById: vi.fn().mockResolvedValue(scenario) },
      Published_Scenario: { deleteOne: vi.fn().mockResolvedValue({}), create: vi.fn().mockResolvedValue({}) }
    };
    getPublishLinkMock.mockResolvedValue('spring-scenario');

    await publishScenarioById({ scenarioId: 's1' }, {}, { models, user: { _id: 'u1' } });

    expect(scenario.hasChanges).toBe(false);
    expect(scenario.isPublished).toBe(true);
    expect(scenario.publishedAt).toEqual(FIXED_NOW);
    expect(scenario.publishedBy).toBe('u1');
    expect(scenario.save).toHaveBeenCalled();
  });

  it('generates a publishLink only when the scenario does not already have one', async () => {
    const scenarioWithoutLink = buildScenario({ publishLink: null });
    const models = {
      Scenario: { findById: vi.fn().mockResolvedValue(scenarioWithoutLink) },
      Published_Scenario: { deleteOne: vi.fn().mockResolvedValue({}), create: vi.fn().mockResolvedValue({}) }
    };
    getPublishLinkMock.mockResolvedValue('generated-link');

    await publishScenarioById({ scenarioId: 's1' }, {}, { models, user: { _id: 'u1' } });

    expect(getPublishLinkMock).toHaveBeenCalledWith({ name: 'Spring Scenario', Model: models.Scenario });
    expect(scenarioWithoutLink.publishLink).toBe('generated-link');
  });

  it('preserves an existing publishLink', async () => {
    const scenario = buildScenario({ publishLink: 'existing-link' });
    const models = {
      Scenario: { findById: vi.fn().mockResolvedValue(scenario) },
      Published_Scenario: { deleteOne: vi.fn().mockResolvedValue({}), create: vi.fn().mockResolvedValue({}) }
    };

    await publishScenarioById({ scenarioId: 's1' }, {}, { models, user: { _id: 'u1' } });

    expect(getPublishLinkMock).not.toHaveBeenCalled();
    expect(scenario.publishLink).toBe('existing-link');
  });

  it('replaces the Published_Scenario doc with the latest scenario state', async () => {
    const scenario = buildScenario({ publishLink: 'existing-link' });
    const models = {
      Scenario: { findById: vi.fn().mockResolvedValue(scenario) },
      Published_Scenario: { deleteOne: vi.fn().mockResolvedValue({}), create: vi.fn().mockResolvedValue({}) }
    };

    await publishScenarioById({ scenarioId: 's1' }, {}, { models, user: { _id: 'u1' } });

    expect(models.Published_Scenario.deleteOne).toHaveBeenCalledWith({ _id: 's1' });
    expect(models.Published_Scenario.create).toHaveBeenCalled();
  });

  it('returns the updated scenario', async () => {
    const scenario = buildScenario({ publishLink: 'existing-link' });
    const models = {
      Scenario: { findById: vi.fn().mockResolvedValue(scenario) },
      Published_Scenario: { deleteOne: vi.fn().mockResolvedValue({}), create: vi.fn().mockResolvedValue({}) }
    };

    const result = await publishScenarioById({ scenarioId: 's1' }, {}, { models, user: { _id: 'u1' } });

    expect(result).toBe(scenario);
  });
});
