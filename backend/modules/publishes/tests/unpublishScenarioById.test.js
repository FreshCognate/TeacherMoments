import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';

const { unpublishModelByScenarioIdMock } = vi.hoisted(() => ({ unpublishModelByScenarioIdMock: vi.fn() }));

vi.mock('../services/unpublishModelByScenarioId.js', () => ({
  default: (...args) => unpublishModelByScenarioIdMock(...args)
}));

import unpublishScenarioById from '../services/unpublishScenarioById.js';

const db = setupMongo();

describe('unpublishScenarioById (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    unpublishModelByScenarioIdMock.mockResolvedValue();
  });

  it('throws 404 when the scenario does not exist', async () => {
    await expect(
      unpublishScenarioById({ scenarioId: new mongoose.Types.ObjectId() }, {}, { models: db.models, user: { _id: new mongoose.Types.ObjectId() } })
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it('throws 400 when the scenario is not currently published', async () => {
    const scenario = await db.models.Scenario.create({ name: 'S', isPublished: false });
    await expect(
      unpublishScenarioById({ scenarioId: scenario._id }, {}, { models: db.models, user: { _id: new mongoose.Types.ObjectId() } })
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  it('unpublishes Slide, Block and Trigger models for the scenario', async () => {
    const scenario = await db.models.Scenario.create({ name: 'S', isPublished: true });
    const ctx = { models: db.models, user: { _id: new mongoose.Types.ObjectId() } };

    await unpublishScenarioById({ scenarioId: scenario._id }, {}, ctx);

    expect(unpublishModelByScenarioIdMock).toHaveBeenCalledWith({ model: 'Slide', scenarioId: scenario._id }, {}, ctx);
    expect(unpublishModelByScenarioIdMock).toHaveBeenCalledWith({ model: 'Block', scenarioId: scenario._id }, {}, ctx);
    expect(unpublishModelByScenarioIdMock).toHaveBeenCalledWith({ model: 'Trigger', scenarioId: scenario._id }, {}, ctx);
  });

  it('deletes the Published_Scenario doc and clears publish flags', async () => {
    const scenario = await db.models.Scenario.create({
      name: 'S', isPublished: true, publishedAt: new Date(), publishedBy: new mongoose.Types.ObjectId()
    });
    await db.models.Published_Scenario.create({ _id: scenario._id, name: 'S', isPublished: true });

    await unpublishScenarioById({ scenarioId: scenario._id }, {}, { models: db.models, user: { _id: new mongoose.Types.ObjectId() } });

    expect(await db.models.Published_Scenario.findById(scenario._id).lean()).toBeNull();

    const stored = await db.models.Scenario.findById(scenario._id).lean();
    expect(stored.isPublished).toBe(false);
    expect(stored.hasChanges).toBe(true);
    expect(stored.publishedAt).toBeNull();
    expect(stored.publishedBy).toBeNull();
  });
});
