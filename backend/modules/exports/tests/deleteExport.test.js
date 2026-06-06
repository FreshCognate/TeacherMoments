import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';

const { sendMock, DeleteObjectCommandMock } = vi.hoisted(() => ({
  sendMock: vi.fn(),
  DeleteObjectCommandMock: vi.fn()
}));

vi.mock('@aws-sdk/client-s3', () => ({
  S3Client: function () { return { send: sendMock }; },
  DeleteObjectCommand: function (params) { DeleteObjectCommandMock(params); return { params }; }
}));

import deleteExport from '../services/deleteExport.js';

const db = setupMongo();

describe('deleteExport (in-memory mongo)', () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
    process.env.STORAGE_ENDPOINT = 'sfo3.digitaloceanspaces.com';
    process.env.STORAGE_KEY = 'k';
    process.env.STORAGE_SECRET = 's';
    process.env.STORAGE_NAME = 'b';
    vi.clearAllMocks();
    sendMock.mockResolvedValue({});
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('throws 404 when no matching export is found for the user', async () => {
    await expect(
      deleteExport({ exportId: new mongoose.Types.ObjectId() }, {}, { models: db.models, user: { _id: new mongoose.Types.ObjectId() } })
    ).rejects.toMatchObject({ statusCode: 404, message: 'Export not found' });
  });

  it('does not call S3 when there is no filePath and deletes the record', async () => {
    const userId = new mongoose.Types.ObjectId();
    const record = await db.models.Export.create({ exportType: 'USER_HISTORY', createdBy: userId });

    const result = await deleteExport({ exportId: record._id }, {}, { models: db.models, user: { _id: userId } });

    expect(sendMock).not.toHaveBeenCalled();
    expect(await db.models.Export.findById(record._id).lean()).toBeNull();
    expect(result).toEqual({ success: true });
  });

  it('deletes the S3 object when filePath is set', async () => {
    const userId = new mongoose.Types.ObjectId();
    const record = await db.models.Export.create({ exportType: 'USER_HISTORY', createdBy: userId, filePath: 'exports/2026/data.csv' });

    await deleteExport({ exportId: record._id }, {}, { models: db.models, user: { _id: userId } });

    expect(DeleteObjectCommandMock).toHaveBeenCalledWith({ Bucket: 'b', Key: 'exports/2026/data.csv' });
    expect(sendMock).toHaveBeenCalled();
    expect(await db.models.Export.findById(record._id).lean()).toBeNull();
  });

  it('does not delete an export owned by another user', async () => {
    const record = await db.models.Export.create({ exportType: 'USER_HISTORY', createdBy: new mongoose.Types.ObjectId() });

    await expect(
      deleteExport({ exportId: record._id }, {}, { models: db.models, user: { _id: new mongoose.Types.ObjectId() } })
    ).rejects.toMatchObject({ statusCode: 404 });

    expect(await db.models.Export.findById(record._id).lean()).toBeTruthy();
  });
});
