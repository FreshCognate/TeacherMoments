import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import getAssetUrl from '../getAssetUrl.js';

describe('getAssetUrl', () => {
  let originalName, originalEndpoint;

  beforeEach(() => {
    originalName = process.env.STORAGE_NAME;
    originalEndpoint = process.env.STORAGE_ENDPOINT;
    process.env.STORAGE_NAME = 'my-bucket';
    process.env.STORAGE_ENDPOINT = 'nyc3.digitaloceanspaces.com';
  });

  afterEach(() => {
    process.env.STORAGE_NAME = originalName;
    process.env.STORAGE_ENDPOINT = originalEndpoint;
  });

  it('builds the public URL from storage env + key path, defaulting size to "preview"', () => {
    const url = getAssetUrl({ fileType: 'image', _id: 'a1', name: 'photo', extension: 'jpg' });
    expect(url).toBe('https://my-bucket.nyc3.digitaloceanspaces.com/assets/images/a1/preview/photo.jpg');
  });

  it('rewrites gif → jpg for placeholder/preview but keeps it for original', () => {
    const previewUrl = getAssetUrl({ fileType: 'image', _id: 'a1', name: 'logo', extension: 'gif' }, 'preview');
    const placeholderUrl = getAssetUrl({ fileType: 'image', _id: 'a1', name: 'logo', extension: 'gif' }, 'placeholder');
    const originalUrl = getAssetUrl({ fileType: 'image', _id: 'a1', name: 'logo', extension: 'gif' }, 'original');

    expect(previewUrl).toBe('https://my-bucket.nyc3.digitaloceanspaces.com/assets/images/a1/preview/logo.jpg');
    expect(placeholderUrl).toBe('https://my-bucket.nyc3.digitaloceanspaces.com/assets/images/a1/placeholder/logo.jpg');
    expect(originalUrl).toBe('https://my-bucket.nyc3.digitaloceanspaces.com/assets/images/a1/original/logo.gif');
  });
});
