import { describe, it, expect, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';
import getAssets from '../services/getAssets.js';

const db = setupMongo();

const createAsset = (overrides = {}) => db.models.Asset.create({
  name: 'asset',
  fileType: 'image',
  extension: 'png',
  createdBy: new mongoose.Types.ObjectId(),
  ...overrides
});

describe('getAssets (in-memory mongo)', () => {
  beforeEach(() => {});

  it('excludes deleted assets by default and supports isDeleted=true', async () => {
    await createAsset({ name: 'active' });
    await createAsset({ name: 'gone', isDeleted: true });

    const active = await getAssets({}, {}, { models: db.models });
    expect(active.assets.map((a) => a.name)).toEqual(['active']);

    const deleted = await getAssets({}, { isDeleted: true }, { models: db.models });
    expect(deleted.assets.map((a) => a.name)).toEqual(['gone']);
  });

  it('builds a regex search on name when searchValue is set', async () => {
    await createAsset({ name: 'photo-1' });
    await createAsset({ name: 'document' });

    const result = await getAssets({}, { searchValue: 'photo' }, { models: db.models });
    expect(result.assets.map((a) => a.name)).toEqual(['photo-1']);
  });

  it('returns assets, count, currentPage and totalPages', async () => {
    await createAsset({ name: 'only' });
    const result = await getAssets({}, { currentPage: 1 }, { models: db.models });
    expect(result).toMatchObject({ count: 1, currentPage: 1, totalPages: 1 });
  });
});
