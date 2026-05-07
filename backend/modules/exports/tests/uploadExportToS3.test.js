import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { S3ClientMock, UploadConstructorMock, uploadDoneMock } = vi.hoisted(() => ({
  S3ClientMock: vi.fn(),
  UploadConstructorMock: vi.fn(),
  uploadDoneMock: vi.fn()
}));

vi.mock('@aws-sdk/client-s3', () => ({
  S3Client: function (config) { S3ClientMock(config); return { name: 'client' }; }
}));

vi.mock('@aws-sdk/lib-storage', () => ({
  Upload: function (args) {
    UploadConstructorMock(args);
    return { done: uploadDoneMock };
  }
}));

import uploadExportToS3 from '../helpers/uploadExportToS3.js';

describe('uploadExportToS3', () => {
  let originalEndpoint;
  let originalKey;
  let originalSecret;
  let originalName;

  beforeEach(() => {
    originalEndpoint = process.env.STORAGE_ENDPOINT;
    originalKey = process.env.STORAGE_KEY;
    originalSecret = process.env.STORAGE_SECRET;
    originalName = process.env.STORAGE_NAME;
    process.env.STORAGE_ENDPOINT = 'sfo3.digitaloceanspaces.com';
    process.env.STORAGE_KEY = 'access-key';
    process.env.STORAGE_SECRET = 'secret-key';
    process.env.STORAGE_NAME = 'my-bucket';
    vi.clearAllMocks();
    uploadDoneMock.mockResolvedValue();
  });

  afterEach(() => {
    process.env.STORAGE_ENDPOINT = originalEndpoint;
    process.env.STORAGE_KEY = originalKey;
    process.env.STORAGE_SECRET = originalSecret;
    process.env.STORAGE_NAME = originalName;
  });

  it('configures the S3 client from environment variables', async () => {
    await uploadExportToS3({ filePath: 'a/b.csv', body: Buffer.from('x'), contentType: 'text/csv', contentDisposition: 'attachment' });

    expect(S3ClientMock).toHaveBeenCalledWith({
      endpoint: 'https://sfo3.digitaloceanspaces.com',
      region: 'sfo3',
      credentials: { accessKeyId: 'access-key', secretAccessKey: 'secret-key' }
    });
  });

  it('forwards the upload params to lib-storage Upload', async () => {
    const body = Buffer.from('csv');

    await uploadExportToS3({
      filePath: 'a/b.csv',
      body,
      contentType: 'text/csv',
      contentDisposition: 'attachment; filename="report.csv"'
    });

    expect(UploadConstructorMock).toHaveBeenCalledWith({
      client: expect.anything(),
      params: {
        Bucket: 'my-bucket',
        Key: 'a/b.csv',
        Body: body,
        ContentType: 'text/csv',
        ContentDisposition: 'attachment; filename="report.csv"'
      }
    });
  });

  it('awaits the upload to complete', async () => {
    await uploadExportToS3({ filePath: 'a.csv', body: '', contentType: 'text/csv', contentDisposition: '' });
    expect(uploadDoneMock).toHaveBeenCalled();
  });
});
