import { describe, it, expect, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';
import getBlocks from '../services/getBlocks.js';

const db = setupMongo();

const createBlock = (overrides = {}) => db.models.Block.create({
  scenario: new mongoose.Types.ObjectId(),
  slideRef: new mongoose.Types.ObjectId(),
  name: 'Block',
  ...overrides
});

describe('getBlocks (in-memory mongo)', () => {
  beforeEach(() => {});

  it('excludes deleted blocks by default', async () => {
    await createBlock({ name: 'Active' });
    await createBlock({ name: 'Deleted', isDeleted: true });

    const { blocks, count } = await getBlocks({}, {}, { models: db.models });
    expect(blocks.map((b) => b.name)).toEqual(['Active']);
    expect(count).toBe(1);
  });

  it('honours a scenario filter', async () => {
    const scenario = new mongoose.Types.ObjectId();
    await createBlock({ scenario, name: 'InScenario' });
    await createBlock({ name: 'Elsewhere' });

    const { blocks } = await getBlocks({ scenario }, {}, { models: db.models });
    expect(blocks.map((b) => b.name)).toEqual(['InScenario']);
  });

  it('builds a search on name when searchValue is set', async () => {
    await createBlock({ name: 'FooBlock' });
    await createBlock({ name: 'BarBlock' });

    const { blocks } = await getBlocks({}, { searchValue: 'foo' }, { models: db.models });
    expect(blocks.map((b) => b.name)).toEqual(['FooBlock']);
  });

  it('returns blocks, count, currentPage, totalPages', async () => {
    await createBlock({ name: 'Only' });
    const result = await getBlocks({}, {}, { models: db.models });
    expect(result).toMatchObject({ count: 1, currentPage: 1, totalPages: 1 });
    expect(result.blocks).toHaveLength(1);
  });
});
