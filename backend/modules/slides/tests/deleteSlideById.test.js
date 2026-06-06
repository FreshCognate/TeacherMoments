import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
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

import deleteSlideById from '../services/deleteSlideById.js';

const db = setupMongo();

let Slide;
let Block;

beforeAll(() => {
  Slide = db.models.Slide;
  Block = db.models.Block;
});

const buildContext = () => ({
  models: db.models,
  user: { _id: new mongoose.Types.ObjectId() }
});

const sortOrdersFor = async (scenarioId, stemRef) => {
  const slides = await Slide.find({ scenario: scenarioId, stemRef, isDeleted: false }).lean();
  return sortBy(slides, 'sortOrder').map((slide) => slide.sortOrder);
};

describe('deleteSlideById (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
  });

  it('throws 404 when the slide does not exist', async () => {
    await expect(
      deleteSlideById({ slideId: new mongoose.Types.ObjectId() }, {}, buildContext())
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it('soft-deletes the slide and reindexes the remaining siblings in its stem from 0', async () => {
    const scenario = new mongoose.Types.ObjectId();
    const stemRef = new mongoose.Types.ObjectId();

    const [first, second, third] = await Slide.create([
      { scenario, stemRef, sortOrder: 0 },
      { scenario, stemRef, sortOrder: 1 },
      { scenario, stemRef, sortOrder: 2 }
    ]);

    await deleteSlideById({ slideId: second._id }, {}, buildContext());

    const deleted = await Slide.findById(second._id).lean();
    expect(deleted.isDeleted).toBe(true);

    expect(await sortOrdersFor(scenario, stemRef)).toEqual([0, 1]);

    const survivors = sortBy(
      await Slide.find({ scenario, stemRef, isDeleted: false }).lean(),
      'sortOrder'
    ).map((slide) => String(slide._id));
    expect(survivors).toEqual([String(first._id), String(third._id)]);

    expect(setHasChangesMock).toHaveBeenCalledWith({ scenarioId: scenario }, {}, expect.any(Object));
  });

  it('only reindexes siblings within the deleted slide\'s stem, leaving other stems untouched', async () => {
    const scenario = new mongoose.Types.ObjectId();
    const stemA = new mongoose.Types.ObjectId();
    const stemB = new mongoose.Types.ObjectId();

    const [, stemAMiddle] = await Slide.create([
      { scenario, stemRef: stemA, sortOrder: 0 },
      { scenario, stemRef: stemA, sortOrder: 1 },
      { scenario, stemRef: stemA, sortOrder: 2 }
    ]);

    await Slide.create([
      { scenario, stemRef: stemB, sortOrder: 0 },
      { scenario, stemRef: stemB, sortOrder: 1 }
    ]);

    await deleteSlideById({ slideId: stemAMiddle._id }, {}, buildContext());

    expect(await sortOrdersFor(scenario, stemA)).toEqual([0, 1]);
    expect(await sortOrdersFor(scenario, stemB)).toEqual([0, 1]);
  });

  it('soft-deletes the blocks belonging to the slide', async () => {
    const scenario = new mongoose.Types.ObjectId();
    const stemRef = new mongoose.Types.ObjectId();

    const [slide] = await Slide.create([{ scenario, stemRef, sortOrder: 0 }]);
    await Block.create([
      { slideRef: slide.ref, scenario },
      { slideRef: slide.ref, scenario }
    ]);

    await deleteSlideById({ slideId: slide._id }, {}, buildContext());

    const remainingActiveBlocks = await Block.countDocuments({ slideRef: slide.ref, isDeleted: false });
    expect(remainingActiveBlocks).toBe(0);
  });
});
