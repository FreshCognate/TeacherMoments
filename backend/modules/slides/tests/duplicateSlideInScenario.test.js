import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import sortBy from 'lodash/sortBy.js';
import { setupMongo } from '../../../../tests/with-mongo.js';

const { checkAccessMock, duplicateBlocksMock, setHasChangesMock } = vi.hoisted(() => ({
  checkAccessMock: vi.fn(),
  duplicateBlocksMock: vi.fn(),
  setHasChangesMock: vi.fn()
}));

vi.mock('../../scenarios/helpers/checkHasAccessToScenario.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));
vi.mock('../../blocks/services/duplicateBlocks.js', () => ({
  default: (...args) => duplicateBlocksMock(...args)
}));
vi.mock('../../scenarios/services/setScenarioHasChanges.js', () => ({
  default: (...args) => setHasChangesMock(...args)
}));

import duplicateSlideInScenario from '../services/duplicateSlideInScenario.js';

const db = setupMongo();

let Slide;

beforeAll(() => {
  Slide = db.models.Slide;
});

const buildContext = () => ({
  models: db.models,
  connection: db.connection
});

const sortOrdersFor = async (scenarioId, stemRef) => {
  const slides = await Slide.find({ scenario: scenarioId, stemRef, isDeleted: false }).lean();
  return sortBy(slides, 'sortOrder').map((slide) => slide.sortOrder);
};

describe('duplicateSlideInScenario (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
    duplicateBlocksMock.mockResolvedValue();
  });

  it('throws 404 when the source slide does not exist', async () => {
    await expect(
      duplicateSlideInScenario(
        { scenario: new mongoose.Types.ObjectId(), slideId: new mongoose.Types.ObjectId() },
        buildContext()
      )
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it('clones the slide one position after the source, carrying over its fields', async () => {
    const scenario = new mongoose.Types.ObjectId();
    const stemRef = new mongoose.Types.ObjectId();

    const [, source] = await Slide.create([
      { scenario, stemRef, sortOrder: 0, name: 'First', slideType: 'STEP' },
      { scenario, stemRef, sortOrder: 1, name: 'Source', slideType: 'STEP' },
      { scenario, stemRef, sortOrder: 2, name: 'Third', slideType: 'STEP' }
    ]);

    const duplicated = await duplicateSlideInScenario(
      { scenario, slideId: source._id },
      buildContext()
    );

    expect(duplicated.name).toBe('Source');
    expect(duplicated.slideType).toBe('STEP');
    expect(String(duplicated.stemRef)).toBe(String(stemRef));
    expect(duplicated.sortOrder).toBe(2);
    expect(String(duplicated.originalRef)).toBe(String(source.ref));

    // Source stem now holds 4 slides with contiguous order.
    expect(await sortOrdersFor(scenario, stemRef)).toEqual([0, 1, 2, 3]);

    expect(duplicateBlocksMock).toHaveBeenCalled();
    expect(setHasChangesMock).toHaveBeenCalledWith({ scenarioId: scenario }, {}, expect.any(Object));
  });

  it('only shifts siblings within the source slide\'s stem, leaving other stems untouched', async () => {
    const scenario = new mongoose.Types.ObjectId();
    const stemA = new mongoose.Types.ObjectId();
    const stemB = new mongoose.Types.ObjectId();

    const [stemASource] = await Slide.create([
      { scenario, stemRef: stemA, sortOrder: 0, name: 'A0' },
      { scenario, stemRef: stemA, sortOrder: 1, name: 'A1' }
    ]);

    await Slide.create([
      { scenario, stemRef: stemB, sortOrder: 0, name: 'B0' },
      { scenario, stemRef: stemB, sortOrder: 1, name: 'B1' }
    ]);

    await duplicateSlideInScenario(
      { scenario, slideId: stemASource._id },
      buildContext()
    );

    // Stem A gained one slide and stays contiguous; stem B is untouched.
    expect(await sortOrdersFor(scenario, stemA)).toEqual([0, 1, 2]);
    expect(await sortOrdersFor(scenario, stemB)).toEqual([0, 1]);
  });
});
