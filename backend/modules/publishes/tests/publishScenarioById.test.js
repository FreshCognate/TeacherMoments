import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';

const { getPublishLinkMock, publishModelByScenarioIdMock } = vi.hoisted(() => ({
  getPublishLinkMock: vi.fn(),
  publishModelByScenarioIdMock: vi.fn()
}));

vi.mock('../helpers/getPublishLink.js', () => ({ default: (...args) => getPublishLinkMock(...args) }));
vi.mock('../services/publishModelByScenarioId.js', () => ({ default: (...args) => publishModelByScenarioIdMock(...args) }));

import publishScenarioById from '../services/publishScenarioById.js';

const db = setupMongo();

describe('publishScenarioById (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    publishModelByScenarioIdMock.mockResolvedValue();
    getPublishLinkMock.mockResolvedValue('generated-link');
  });

  it('throws 404 when the scenario does not exist', async () => {
    await expect(
      publishScenarioById({ scenarioId: new mongoose.Types.ObjectId() }, {}, { models: db.models, user: { _id: new mongoose.Types.ObjectId() } })
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it('publishes Slide, Block, Trigger and Stem models for the scenario', async () => {
    const scenario = await db.models.Scenario.create({ name: 'Spring' });
    const ctx = { models: db.models, user: { _id: new mongoose.Types.ObjectId() } };

    await publishScenarioById({ scenarioId: scenario._id }, {}, ctx);

    expect(publishModelByScenarioIdMock).toHaveBeenCalledWith({ model: 'Slide', scenarioId: scenario._id }, {}, ctx);
    expect(publishModelByScenarioIdMock).toHaveBeenCalledWith({ model: 'Block', scenarioId: scenario._id }, {}, ctx);
    expect(publishModelByScenarioIdMock).toHaveBeenCalledWith({ model: 'Trigger', scenarioId: scenario._id }, {}, ctx);
    expect(publishModelByScenarioIdMock).toHaveBeenCalledWith({ model: 'Stem', scenarioId: scenario._id }, {}, ctx);
  });

  it('marks the scenario published with timestamp/actor and clears hasChanges', async () => {
    const userId = new mongoose.Types.ObjectId();
    const scenario = await db.models.Scenario.create({ name: 'Spring', hasChanges: true });

    await publishScenarioById({ scenarioId: scenario._id }, {}, { models: db.models, user: { _id: userId } });

    const stored = await db.models.Scenario.findById(scenario._id).lean();
    expect(stored.isPublished).toBe(true);
    expect(stored.hasChanges).toBe(false);
    expect(stored.publishedAt).toBeInstanceOf(Date);
    expect(String(stored.publishedBy)).toBe(String(userId));
  });

  it('generates a publishLink only when the scenario has none, and replaces the Published_Scenario doc', async () => {
    const scenario = await db.models.Scenario.create({ name: 'Spring' });

    await publishScenarioById({ scenarioId: scenario._id }, {}, { models: db.models, user: { _id: new mongoose.Types.ObjectId() } });

    const stored = await db.models.Scenario.findById(scenario._id).lean();
    expect(stored.publishLink).toBe('generated-link');

    const published = await db.models.Published_Scenario.findById(scenario._id).lean();
    expect(published).toBeTruthy();
    expect(published.publishLink).toBe('generated-link');
  });

  it('preserves an existing publishLink', async () => {
    const scenario = await db.models.Scenario.create({ name: 'Spring', publishLink: 'existing-link' });

    await publishScenarioById({ scenarioId: scenario._id }, {}, { models: db.models, user: { _id: new mongoose.Types.ObjectId() } });

    expect(getPublishLinkMock).not.toHaveBeenCalled();
    const stored = await db.models.Scenario.findById(scenario._id).lean();
    expect(stored.publishLink).toBe('existing-link');
  });
});
