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

  it('soft-deletes the stem and cascades to its slides and blocks', async () => {
    const scenario = new mongoose.Types.ObjectId();

    const stem = await db.models.Stem.create({ scenario, isRoot: true });

    const slide = await db.models.Slide.create({ scenario, stemRef: stem.ref, sortOrder: 0 });
    const otherSlide = await db.models.Slide.create({ scenario, stemRef: stem.ref, sortOrder: 1 });

    const block = await db.models.Block.create({ scenario, slideRef: slide.ref });
    const otherBlock = await db.models.Block.create({ scenario, slideRef: otherSlide.ref });

    const ctx = { models: db.models, user: { _id: new mongoose.Types.ObjectId() }, connection: db.connection };
    const result = await deleteStemById({ stemId: stem._id }, {}, ctx);

    const isDeleted = async (Model, id) => (await Model.findById(id).lean()).isDeleted;

    // The stem and its slides (which carry stemRef) cascade-delete.
    expect(await isDeleted(db.models.Stem, stem._id)).toBe(true);
    expect(await isDeleted(db.models.Slide, slide._id)).toBe(true);
    expect(await isDeleted(db.models.Slide, otherSlide._id)).toBe(true);

    // Blocks are reached through their slide (block.slideRef === slide.ref).
    expect(await isDeleted(db.models.Block, block._id)).toBe(true);
    expect(await isDeleted(db.models.Block, otherBlock._id)).toBe(true);

    expect(setHasChangesMock).toHaveBeenCalledWith({ scenarioId: scenario }, {}, ctx);
    expect(String(result._id)).toBe(String(stem._id));
  });
});
