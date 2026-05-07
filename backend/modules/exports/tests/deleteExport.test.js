import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { sendMock, S3ClientMock, DeleteObjectCommandMock } = vi.hoisted(() => ({
  sendMock: vi.fn(),
  S3ClientMock: vi.fn(),
  DeleteObjectCommandMock: vi.fn()
}));

vi.mock('@aws-sdk/client-s3', () => ({
  S3Client: function (config) { S3ClientMock(config); return { send: sendMock }; },
  DeleteObjectCommand: function (params) { DeleteObjectCommandMock(params); return { name: 'delete-command', params }; }
}));

import deleteExport from '../services/deleteExport.js';

describe('deleteExport', () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
    process.env.STORAGE_ENDPOINT = 'sfo3.digitaloceanspaces.com';
    process.env.STORAGE_KEY = 'k';
    process.env.STORAGE_SECRET = 's';
    process.env.STORAGE_NAME = 'b';
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('throws 404 when no matching export is found', async () => {
    const models = {
      Export: {
        findOne: vi.fn().mockResolvedValue(null),
        deleteOne: vi.fn()
      }
    };

    await expect(deleteExport(
      { exportId: 'missing' },
      {},
      { models, user: { _id: 'u1' } }
    )).rejects.toMatchObject({ statusCode: 404, message: 'Export not found' });
  });

  it('queries for an export owned by the requesting user', async () => {
    const models = {
      Export: {
        findOne: vi.fn().mockResolvedValue({ _id: 'e1' }),
        deleteOne: vi.fn().mockResolvedValue({})
      }
    };

    await deleteExport({ exportId: 'e1' }, {}, { models, user: { _id: 'u1' } });

    expect(models.Export.findOne).toHaveBeenCalledWith({ _id: 'e1', createdBy: 'u1' });
  });

  it('does not call S3 when there is no filePath', async () => {
    const models = {
      Export: {
        findOne: vi.fn().mockResolvedValue({ _id: 'e1' }),
        deleteOne: vi.fn().mockResolvedValue({})
      }
    };

    await deleteExport({ exportId: 'e1' }, {}, { models, user: { _id: 'u1' } });

    expect(sendMock).not.toHaveBeenCalled();
    expect(models.Export.deleteOne).toHaveBeenCalledWith({ _id: 'e1' });
  });

  it('deletes the S3 object when filePath is set', async () => {
    const models = {
      Export: {
        findOne: vi.fn().mockResolvedValue({ _id: 'e1', filePath: 'exports/2026/data.csv' }),
        deleteOne: vi.fn().mockResolvedValue({})
      }
    };
    sendMock.mockResolvedValue({});

    await deleteExport({ exportId: 'e1' }, {}, { models, user: { _id: 'u1' } });

    expect(DeleteObjectCommandMock).toHaveBeenCalledWith({ Bucket: 'b', Key: 'exports/2026/data.csv' });
    expect(sendMock).toHaveBeenCalled();
    expect(models.Export.deleteOne).toHaveBeenCalledWith({ _id: 'e1' });
  });

  it('returns success: true', async () => {
    const models = {
      Export: {
        findOne: vi.fn().mockResolvedValue({ _id: 'e1' }),
        deleteOne: vi.fn().mockResolvedValue({})
      }
    };

    const result = await deleteExport({ exportId: 'e1' }, {}, { models, user: { _id: 'u1' } });

    expect(result).toEqual({ success: true });
  });
});
