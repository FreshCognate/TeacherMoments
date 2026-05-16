import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { getSignedUrlMock, S3ClientMock, PutObjectCommandMock } = vi.hoisted(() => ({
  getSignedUrlMock: vi.fn(),
  S3ClientMock: vi.fn(),
  PutObjectCommandMock: vi.fn()
}));

vi.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: (...args) => getSignedUrlMock(...args)
}));

vi.mock('@aws-sdk/client-s3', () => ({
  S3Client: function (config) { S3ClientMock(config); return { name: 'client' }; },
  PutObjectCommand: function (params) { PutObjectCommandMock(params); return { name: 'put-command', params }; }
}));

import getUploadSignedUrl from '../helpers/getUploadSignedUrl.js';

describe('getUploadSignedUrl', () => {
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
    getSignedUrlMock.mockResolvedValue('https://signed.example.com/upload');
  });

  afterEach(() => {
    process.env.STORAGE_ENDPOINT = originalEndpoint;
    process.env.STORAGE_KEY = originalKey;
    process.env.STORAGE_SECRET = originalSecret;
    process.env.STORAGE_NAME = originalName;
  });

  it('configures the S3 client from environment variables', async () => {
    await getUploadSignedUrl({ assetPath: 'a/b/c.jpg', ACL: 'public-read', ContentType: 'image/jpeg' });

    expect(S3ClientMock).toHaveBeenCalledWith({
      endpoint: 'https://sfo3.digitaloceanspaces.com',
      region: 'sfo3',
      credentials: {
        accessKeyId: 'access-key',
        secretAccessKey: 'secret-key'
      }
    });
  });

  it('builds a PutObjectCommand for the asset path with ACL and ContentType', async () => {
    await getUploadSignedUrl({ assetPath: 'assets/images/abc/original/file.jpg', ACL: 'public-read', ContentType: 'image/jpeg' });

    expect(PutObjectCommandMock).toHaveBeenCalledWith({
      Bucket: 'my-bucket',
      Key: 'assets/images/abc/original/file.jpg',
      ACL: 'public-read',
      ContentType: 'image/jpeg'
    });
  });

  it('signs the URL with a 1-hour expiry', async () => {
    await getUploadSignedUrl({ assetPath: 'a.jpg', ACL: 'public-read', ContentType: 'image/jpeg' });

    expect(getSignedUrlMock).toHaveBeenCalledWith(expect.anything(), expect.anything(), { expiresIn: 3600 });
  });

  it('returns the signed URL string', async () => {
    const url = await getUploadSignedUrl({ assetPath: 'a.jpg', ACL: 'public-read', ContentType: 'image/jpeg' });
    expect(url).toBe('https://signed.example.com/upload');
  });
});
