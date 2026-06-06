import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import sortBy from 'lodash/sortBy.js';
import { setupMongo } from '../../../../tests/with-mongo.js';

const { checkAccessMock, setHasChangesMock } = vi.hoisted(() => ({
  checkAccessMock: vi.fn(),
  setHasChangesMock: vi.fn()
}));

vi.mock('../../scenarios/helpers/checkHasAccessToScenario.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));
vi.mock('../../scenarios/services/setScenarioHasChanges.js', () => ({
  default: (...args) => setHasChangesMock(...args)
}));

import createSlide from '../services/createSlide.js';

const db = setupMongo();

const buildContext = () => ({
  models: db.models,
  user: { _id: new mongoose.Types.ObjectId() }
});

const sortOrdersFor = async (scenarioId, stemRef) => {
  const slides = await db.models.Slide.find({ scenario: scenarioId, stemRef, isDeleted: false }).lean();
  return sortBy(slides, 'sortOrder').map((slide) => slide.sortOrder);
};

describe('createSlide (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
  });

  it('throws when the scenario does not exist', async () => {
    await expect(
      createSlide(
        { scenario: new mongoose.Types.ObjectId(), sortOrder: 0, stemRef: new mongoose.Types.ObjectId() },
        {},
        buildContext()
      )
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  it('shifts the sortOrder of same-stem slides at or above the insertion index, then creates the new slide', async () => {
    const scenario = await db.models.Scenario.create({ name: 'Test' });
    const stemRef = new mongoose.Types.ObjectId();

    await db.models.Slide.create([
      { scenario: scenario._id, stemRef, sortOrder: 0 },
      { scenario: scenario._id, stemRef, sortOrder: 1 },
      { scenario: scenario._id, stemRef, sortOrder: 2 }
    ]);

    const slide = await createSlide(
      { scenario: scenario._id, sortOrder: 1, stemRef },
      {},
      buildContext()
    );

    expect(slide.sortOrder).toBe(1);
    expect(await sortOrdersFor(scenario._id, stemRef)).toEqual([0, 1, 2, 3]);
    expect(setHasChangesMock).toHaveBeenCalledWith({ scenarioId: scenario._id }, {}, expect.any(Object));
  });

  it('only shifts siblings within the same stem, leaving other stems untouched', async () => {
    const scenario = await db.models.Scenario.create({ name: 'Test' });
    const stemA = new mongoose.Types.ObjectId();
    const stemB = new mongoose.Types.ObjectId();

    await db.models.Slide.create([
      { scenario: scenario._id, stemRef: stemA, sortOrder: 0 },
      { scenario: scenario._id, stemRef: stemA, sortOrder: 1 },
      { scenario: scenario._id, stemRef: stemB, sortOrder: 0 },
      { scenario: scenario._id, stemRef: stemB, sortOrder: 1 }
    ]);

    await createSlide(
      { scenario: scenario._id, sortOrder: 1, stemRef: stemA },
      {},
      buildContext()
    );

    expect(await sortOrdersFor(scenario._id, stemA)).toEqual([0, 1, 2]);
    // Stem B is untouched — no phantom shift from creating a slide in stem A.
    expect(await sortOrdersFor(scenario._id, stemB)).toEqual([0, 1]);
  });
});
