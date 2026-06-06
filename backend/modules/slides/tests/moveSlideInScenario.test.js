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

import moveSlideInScenario from '../services/moveSlideInScenario.js';

const db = setupMongo();

let Slide;

beforeAll(() => {
  Slide = db.models.Slide;
});

const buildContext = () => ({
  models: db.models,
  connection: db.connection,
  user: { _id: new mongoose.Types.ObjectId() }
});

const orderedIdsFor = async (scenarioId, stemRef) => {
  const slides = await Slide.find({ scenario: scenarioId, stemRef, isDeleted: false }).lean();
  return sortBy(slides, 'sortOrder').map((slide) => String(slide._id));
};

const sortOrdersFor = async (scenarioId, stemRef) => {
  const slides = await Slide.find({ scenario: scenarioId, stemRef, isDeleted: false }).lean();
  return sortBy(slides, 'sortOrder').map((slide) => slide.sortOrder);
};

describe('moveSlideInScenario (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
  });

  it('throws 404 when the slide does not exist', async () => {
    await expect(
      moveSlideInScenario(
        { scenario: new mongoose.Types.ObjectId(), slideId: new mongoose.Types.ObjectId(), sourceIndex: 0, destinationIndex: 1 },
        buildContext()
      )
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it('returns the slide untouched when sourceIndex equals destinationIndex', async () => {
    const scenario = new mongoose.Types.ObjectId();
    const stemRef = new mongoose.Types.ObjectId();
    const [slide] = await Slide.create([{ scenario, stemRef, sortOrder: 0 }]);

    const result = await moveSlideInScenario(
      { scenario, slideId: slide._id, sourceIndex: 2, destinationIndex: 2 },
      buildContext()
    );

    expect(String(result._id)).toBe(String(slide._id));
    expect(setHasChangesMock).not.toHaveBeenCalled();
  });

  it('moves a slide within its stem and renumbers the resulting order', async () => {
    const scenario = new mongoose.Types.ObjectId();
    const stemRef = new mongoose.Types.ObjectId();

    const [a, b, c] = await Slide.create([
      { scenario, stemRef, sortOrder: 0 },
      { scenario, stemRef, sortOrder: 1 },
      { scenario, stemRef, sortOrder: 2 }
    ]);

    await moveSlideInScenario(
      { scenario, slideId: a._id, sourceIndex: 0, destinationIndex: 2 },
      buildContext()
    );

    // a moved to the end: [b, c, a]
    expect(await orderedIdsFor(scenario, stemRef)).toEqual([
      String(b._id),
      String(c._id),
      String(a._id)
    ]);
    expect(await sortOrdersFor(scenario, stemRef)).toEqual([0, 1, 2]);
    expect(setHasChangesMock).toHaveBeenCalledWith({ scenarioId: scenario }, {}, expect.any(Object));
  });

  it('only reorders within the moved slide\'s stem, leaving other stems untouched', async () => {
    const scenario = new mongoose.Types.ObjectId();
    const stemA = new mongoose.Types.ObjectId();
    const stemB = new mongoose.Types.ObjectId();

    const [a0] = await Slide.create([
      { scenario, stemRef: stemA, sortOrder: 0 },
      { scenario, stemRef: stemA, sortOrder: 1 },
      { scenario, stemRef: stemA, sortOrder: 2 }
    ]);

    const [b0, b1] = await Slide.create([
      { scenario, stemRef: stemB, sortOrder: 0 },
      { scenario, stemRef: stemB, sortOrder: 1 }
    ]);

    await moveSlideInScenario(
      { scenario, slideId: a0._id, sourceIndex: 0, destinationIndex: 2 },
      buildContext()
    );

    // Stem B retains its original order and contiguous sortOrder.
    expect(await orderedIdsFor(scenario, stemB)).toEqual([String(b0._id), String(b1._id)]);
    expect(await sortOrdersFor(scenario, stemB)).toEqual([0, 1]);
  });
});
