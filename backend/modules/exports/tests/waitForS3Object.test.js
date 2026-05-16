import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { sendMock, HeadObjectCommandMock } = vi.hoisted(() => ({
  sendMock: vi.fn(),
  HeadObjectCommandMock: vi.fn()
}));

vi.mock('@aws-sdk/client-s3', () => ({
  S3Client: function () { return { send: sendMock }; },
  HeadObjectCommand: function (params) { HeadObjectCommandMock(params); return { name: 'head', params }; }
}));

import waitForS3Object from '../helpers/waitForS3Object.js';

describe('waitForS3Object', () => {
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

  it('returns true on the first attempt when the object exists', async () => {
    sendMock.mockResolvedValueOnce({});
    const result = await waitForS3Object('a/b.csv');
    expect(result).toBe(true);
    expect(sendMock).toHaveBeenCalledTimes(1);
  });

  it('retries until the object becomes available', async () => {
    vi.useFakeTimers();
    sendMock
      .mockRejectedValueOnce(new Error('not yet'))
      .mockRejectedValueOnce(new Error('not yet'))
      .mockResolvedValueOnce({});

    const promise = waitForS3Object('a/b.csv', { maxAttempts: 5, interval: 100 });

    await vi.advanceTimersByTimeAsync(200);
    const result = await promise;

    expect(result).toBe(true);
    expect(sendMock).toHaveBeenCalledTimes(3);

    vi.useRealTimers();
  });

  it('throws when the object never becomes available within maxAttempts', async () => {
    vi.useFakeTimers();
    sendMock.mockRejectedValue(new Error('still not there'));

    const promise = waitForS3Object('a/b.csv', { maxAttempts: 2, interval: 50 });
    promise.catch(() => {});

    await vi.advanceTimersByTimeAsync(200);
    await expect(promise).rejects.toThrow('File not available after 2 attempts: a/b.csv');

    vi.useRealTimers();
  });

  it('builds a HeadObjectCommand for the bucket+key', async () => {
    sendMock.mockResolvedValue({});
    await waitForS3Object('reports/2026/data.csv');
    expect(HeadObjectCommandMock).toHaveBeenCalledWith({ Bucket: 'b', Key: 'reports/2026/data.csv' });
  });
});
