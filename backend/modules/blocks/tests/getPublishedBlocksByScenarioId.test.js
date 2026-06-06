import { describe, it, expect, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';
import getPublishedBlocksByScenarioId from '../services/getPublishedBlocksByScenarioId.js';

const db = setupMongo();

describe('getPublishedBlocksByScenarioId (in-memory mongo)', () => {
  beforeEach(() => {});

  it('returns the scenario\'s non-deleted published blocks sorted by sortOrder', async () => {
    const scenario = new mongoose.Types.ObjectId();
    const slideRef = new mongoose.Types.ObjectId();

    await db.models.Published_Block.create([
      { scenario, slideRef, sortOrder: 1, name: 'B' },
      { scenario, slideRef, sortOrder: 0, name: 'A' },
      { scenario, slideRef, sortOrder: 2, name: 'Deleted', isDeleted: true }
    ]);

    const { blocks } = await getPublishedBlocksByScenarioId({ scenarioId: scenario }, {}, { models: db.models });
    expect(blocks.map((b) => b.name)).toEqual(['A', 'B']);
  });
});
