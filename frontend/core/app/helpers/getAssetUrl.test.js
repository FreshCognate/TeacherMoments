import { describe, it, expect, beforeEach } from 'vitest';
import getAssetUrl from './getAssetUrl.js';

describe('getAssetUrl', () => {
  beforeEach(() => {
    window.STORAGE_NAME = 'test-bucket';
    window.STORAGE_ENDPOINT = 's3.amazonaws.com';
  });

  it('builds the URL using window.STORAGE_NAME and window.STORAGE_ENDPOINT', () => {
    const url = getAssetUrl(
      { fileType: 'image', _id: 'abc', name: 'photo', extension: 'png' },
      'preview'
    );
    expect(url).toBe('https://test-bucket.s3.amazonaws.com/assets/images/abc/preview/photo.png');
  });

  it('defaults size to "preview" when not provided', () => {
    const url = getAssetUrl({ fileType: 'image', _id: 'abc', name: 'photo', extension: 'png' });
    expect(url).toContain('/preview/');
  });

  it('serves a jpg derivative for gif assets at "preview" or "placeholder" sizes', () => {
    expect(
      getAssetUrl({ fileType: 'image', _id: 'abc', name: 'photo', extension: 'gif' }, 'preview')
    ).toMatch(/\.jpg$/);
    expect(
      getAssetUrl({ fileType: 'image', _id: 'abc', name: 'photo', extension: 'gif' }, 'placeholder')
    ).toMatch(/\.jpg$/);
  });

  it('keeps the gif extension at sizes other than preview/placeholder', () => {
    expect(
      getAssetUrl({ fileType: 'image', _id: 'abc', name: 'photo', extension: 'gif' }, 'original')
    ).toMatch(/\.gif$/);
  });
});
