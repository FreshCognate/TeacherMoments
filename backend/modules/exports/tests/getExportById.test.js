import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';

const { getDownloadSignedUrlMock } = vi.hoisted(() => ({ getDownloadSignedUrlMock: vi.fn() }));

vi.mock('../../assets/helpers/getDownloadSignedUrl.js', () => ({
  default: (...args) => getDownloadSignedUrlMock(...args)
}));

import getExportById from '../services/getExportById.js';

const db = setupMongo();

describe('getExportById (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('throws 404 when no export is found for the user', async () => {
    await expect(
      getExportById({ exportId: new mongoose.Types.ObjectId() }, {}, { models: db.models, user: { _id: new mongoose.Types.ObjectId() } })
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it('returns a null downloadUrl when the export is not COMPLETED', async () => {
    const userId = new mongoose.Types.ObjectId();
    const record = await db.models.Export.create({ exportType: 'USER_HISTORY', createdBy: userId, status: 'PENDING' });

    const result = await getExportById({ exportId: record._id }, {}, { models: db.models, user: { _id: userId } });

    expect(result.downloadUrl).toBeNull();
    expect(getDownloadSignedUrlMock).not.toHaveBeenCalled();
  });

  it('returns a null downloadUrl when the export has no filePath', async () => {
    const userId = new mongoose.Types.ObjectId();
    const record = await db.models.Export.create({ exportType: 'USER_HISTORY', createdBy: userId, status: 'COMPLETED' });

    const result = await getExportById({ exportId: record._id }, {}, { models: db.models, user: { _id: userId } });

    expect(result.downloadUrl).toBeNull();
    expect(getDownloadSignedUrlMock).not.toHaveBeenCalled();
  });

  it('signs a download URL when the export is COMPLETED with a filePath', async () => {
    const userId = new mongoose.Types.ObjectId();
    const record = await db.models.Export.create({ exportType: 'USER_HISTORY', createdBy: userId, status: 'COMPLETED', filePath: 'exports/2026/data.csv' });
    getDownloadSignedUrlMock.mockResolvedValue('https://signed.example.com/download');

    const result = await getExportById({ exportId: record._id }, {}, { models: db.models, user: { _id: userId } });

    expect(getDownloadSignedUrlMock).toHaveBeenCalledWith('exports/2026/data.csv');
    expect(result.downloadUrl).toBe('https://signed.example.com/download');
    expect(String(result.export._id)).toBe(String(record._id));
  });
});
