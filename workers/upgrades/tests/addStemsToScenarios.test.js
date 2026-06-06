import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../tests/with-mongo.js';

const { connectDatabaseMock } = vi.hoisted(() => ({ connectDatabaseMock: vi.fn() }));

vi.mock('../../../backend/core/databases/helpers/connectDatabase.js', () => ({
  default: (...args) => connectDatabaseMock(...args)
}));

import addStemsToScenarios from '../addStemsToScenarios.js';

const db = setupMongo();

describe('addStemsToScenarios (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    connectDatabaseMock.mockResolvedValue({ models: db.models });
  });

  it('creates a root stem and points orphaned slides at it', async () => {
    const scenario = await db.models.Scenario.create({ name: 'A' });
    const slideA = await db.models.Slide.create({ scenario: scenario._id, sortOrder: 0 });
    const slideB = await db.models.Slide.create({ scenario: scenario._id, sortOrder: 1 });

    await addStemsToScenarios();

    const rootStem = await db.models.Stem.findOne({ scenario: scenario._id, isRoot: true }).lean();
    expect(rootStem).toBeTruthy();

    const slides = await db.models.Slide.find({ scenario: scenario._id }).lean();
    for (const slide of slides) {
      expect(String(slide.stemRef)).toBe(String(rootStem.ref));
    }
    expect([slideA, slideB].length).toBe(2);
  });

  it('reuses an existing root stem instead of creating another', async () => {
    const scenario = await db.models.Scenario.create({ name: 'A' });
    const existingRoot = await db.models.Stem.create({ scenario: scenario._id, isRoot: true });
    await db.models.Slide.create({ scenario: scenario._id, sortOrder: 0 });

    await addStemsToScenarios();

    const rootStems = await db.models.Stem.find({ scenario: scenario._id, isRoot: true }).lean();
    expect(rootStems).toHaveLength(1);

    const slide = await db.models.Slide.findOne({ scenario: scenario._id }).lean();
    expect(String(slide.stemRef)).toBe(String(existingRoot.ref));
  });

  it('backfills published scenarios via the Published_ models', async () => {
    const published = await db.models.Published_Scenario.create({ name: 'Published' });
    const publishedSlide = await db.models.Published_Slide.create({ scenario: published._id, sortOrder: 0 });

    await addStemsToScenarios();

    const rootStem = await db.models.Published_Stem.findOne({ scenario: published._id, isRoot: true }).lean();
    expect(rootStem).toBeTruthy();

    const stored = await db.models.Published_Slide.findById(publishedSlide._id).lean();
    expect(String(stored.stemRef)).toBe(String(rootStem.ref));
  });
});
