import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';

const { checkAccessMock, setHasChangesMock } = vi.hoisted(() => ({
  checkAccessMock: vi.fn(),
  setHasChangesMock: vi.fn()
}));

vi.mock('../../scenarios/helpers/checkHasAccessToScenario.js', () => ({ default: (...args) => checkAccessMock(...args) }));
vi.mock('../../scenarios/services/setScenarioHasChanges.js', () => ({ default: (...args) => setHasChangesMock(...args) }));

import deleteStemById from '../services/deleteStemById.js';

const db = setupMongo();

describe('deleteStemById (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
  });

  it('throws 404 when the stem does not exist', async () => {
    await expect(
      deleteStemById({ stemId: new mongoose.Types.ObjectId() }, {}, {
        models: db.models, user: { _id: new mongoose.Types.ObjectId() }, connection: db.connection
      })
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it('soft-deletes the stem and recursively cascades to descendant slides, blocks and child stems', async () => {
    const scenario = new mongoose.Types.ObjectId();

    const rootStem = await db.models.Stem.create({ scenario, isRoot: true });
    const childStem = await db.models.Stem.create({ scenario, stemRef: rootStem.ref });

    const rootSlide = await db.models.Slide.create({ scenario, stemRef: rootStem.ref, sortOrder: 0 });
    const childSlide = await db.models.Slide.create({ scenario, stemRef: childStem.ref, sortOrder: 0 });

    const rootBlock = await db.models.Block.create({ scenario, slideRef: rootSlide.ref });
    const childBlock = await db.models.Block.create({ scenario, slideRef: childSlide.ref });

    const ctx = { models: db.models, user: { _id: new mongoose.Types.ObjectId() }, connection: db.connection };
    const result = await deleteStemById({ stemId: rootStem._id }, {}, ctx);

    const isDeleted = async (Model, id) => (await Model.findById(id).lean()).isDeleted;

    // The stem and its descendant stems + slides cascade-delete (they carry stemRef).
    expect(await isDeleted(db.models.Stem, rootStem._id)).toBe(true);
    expect(await isDeleted(db.models.Stem, childStem._id)).toBe(true);
    expect(await isDeleted(db.models.Slide, rootSlide._id)).toBe(true);
    expect(await isDeleted(db.models.Slide, childSlide._id)).toBe(true);

    // Blocks are reached through their slide (block.slideRef === slide.ref).
    expect(await isDeleted(db.models.Block, rootBlock._id)).toBe(true);
    expect(await isDeleted(db.models.Block, childBlock._id)).toBe(true);

    expect(setHasChangesMock).toHaveBeenCalledWith({ scenarioId: scenario }, {}, ctx);
    expect(String(result._id)).toBe(String(rootStem._id));
  });
});
