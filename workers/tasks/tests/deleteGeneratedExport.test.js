import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { connectDatabaseMock, sendMock, DeleteObjectCommandMock } = vi.hoisted(() => ({
  connectDatabaseMock: vi.fn(),
  sendMock: vi.fn(),
  DeleteObjectCommandMock: vi.fn()
}));

vi.mock('../../../backend/core/databases/helpers/connectDatabase.js', () => ({
  default: (...args) => connectDatabaseMock(...args)
}));
vi.mock('@aws-sdk/client-s3', () => ({
  S3Client: function () { return { send: sendMock }; },
  DeleteObjectCommand: function (params) { DeleteObjectCommandMock(params); return { params }; }
}));

import deleteGeneratedExport from '../deleteGeneratedExport.js';

const buildModels = (exportRecord) => {
  const findById = vi.fn(() => ({ lean: vi.fn().mockResolvedValue(exportRecord) }));
  const deleteOne = vi.fn().mockResolvedValue();
  return { Export: { findById, deleteOne } };
};

describe('deleteGeneratedExport', () => {
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

  it('deletes the S3 object and the export record when filePath is set', async () => {
    const models = buildModels({ _id: 'e1', filePath: 'exports/e1/data.csv' });
    connectDatabaseMock.mockResolvedValue({ models, close: vi.fn() });

    await deleteGeneratedExport({ exportId: 'e1' });

    expect(DeleteObjectCommandMock).toHaveBeenCalledWith({ Bucket: 'b', Key: 'exports/e1/data.csv' });
    expect(sendMock).toHaveBeenCalled();
    expect(models.Export.deleteOne).toHaveBeenCalledWith({ _id: 'e1' });
  });

  it('does not call S3 when there is no filePath but still deletes the record', async () => {
    const models = buildModels({ _id: 'e1' });
    connectDatabaseMock.mockResolvedValue({ models, close: vi.fn() });

    await deleteGeneratedExport({ exportId: 'e1' });

    expect(sendMock).not.toHaveBeenCalled();
    expect(models.Export.deleteOne).toHaveBeenCalledWith({ _id: 'e1' });
  });

  it('does nothing when the export no longer exists', async () => {
    const models = buildModels(null);
    connectDatabaseMock.mockResolvedValue({ models, close: vi.fn() });

    await deleteGeneratedExport({ exportId: 'e1' });

    expect(sendMock).not.toHaveBeenCalled();
    expect(models.Export.deleteOne).not.toHaveBeenCalled();
  });
});
