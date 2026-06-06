import { describe, it, expect, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';
import publishModelByScenarioId from '../services/publishModelByScenarioId.js';

const db = setupMongo();

describe('publishModelByScenarioId (in-memory mongo)', () => {
  beforeEach(() => {});

  it('replaces the Published_Slide docs with the scenario\'s non-deleted drafts', async () => {
    const scenario = new mongoose.Types.ObjectId();
    const stemRef = new mongoose.Types.ObjectId();

    // A stale published doc from a prior publish — should be cleared first.
    await db.models.Published_Slide.create({ scenario, stemRef, sortOrder: 99, name: 'Stale' });

    await db.models.Slide.create([
      { scenario, stemRef, sortOrder: 0, name: 'A' },
      { scenario, stemRef, sortOrder: 1, name: 'B' },
      { scenario, stemRef, sortOrder: 2, name: 'Deleted', isDeleted: true }
    ]);

    await publishModelByScenarioId({ model: 'Slide', scenarioId: scenario }, {}, { models: db.models });

    const published = await db.models.Published_Slide.find({ scenario }).lean();
    expect(published.map((p) => p.name).sort()).toEqual(['A', 'B']);
  });

  it('works for any model name via Published_<model>', async () => {
    const scenario = new mongoose.Types.ObjectId();
    const slideRef = new mongoose.Types.ObjectId();
    await db.models.Block.create([{ scenario, slideRef, sortOrder: 0, name: 'BlockA' }]);

    await publishModelByScenarioId({ model: 'Block', scenarioId: scenario }, {}, { models: db.models });

    const published = await db.models.Published_Block.find({ scenario }).lean();
    expect(published.map((p) => p.name)).toEqual(['BlockA']);
  });
});
