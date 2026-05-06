import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { getSignedUrlMock, S3ClientMock, GetObjectCommandMock } = vi.hoisted(() => ({
  getSignedUrlMock: vi.fn(),
  S3ClientMock: vi.fn(),
  GetObjectCommandMock: vi.fn()
}));

vi.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: (...args) => getSignedUrlMock(...args)
}));

vi.mock('@aws-sdk/client-s3', () => ({
  S3Client: function (config) { S3ClientMock(config); return { name: 'client' }; },
  GetObjectCommand: function (params) { GetObjectCommandMock(params); return { name: 'get-command', params }; }
}));

import getDownloadSignedUrl from '../helpers/getDownloadSignedUrl.js';

describe('getDownloadSignedUrl', () => {
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
    getSignedUrlMock.mockResolvedValue('https://signed.example.com/download');
  });

  afterEach(() => {
    process.env.STORAGE_ENDPOINT = originalEndpoint;
    process.env.STORAGE_KEY = originalKey;
    process.env.STORAGE_SECRET = originalSecret;
    process.env.STORAGE_NAME = originalName;
  });

  it('builds a GetObjectCommand for the asset path', async () => {
    await getDownloadSignedUrl('assets/images/abc/original/file.jpg');

    expect(GetObjectCommandMock).toHaveBeenCalledWith({
      Bucket: 'my-bucket',
      Key: 'assets/images/abc/original/file.jpg'
    });
  });

  it('signs the URL with a 1-hour expiry and returns it', async () => {
    const url = await getDownloadSignedUrl('a.jpg');
    expect(getSignedUrlMock).toHaveBeenCalledWith(expect.anything(), expect.anything(), { expiresIn: 3600 });
    expect(url).toBe('https://signed.example.com/download');
  });
});
