import { describe, it, expect } from 'vitest';
import getAssetKey from '../getAssetKey.js';

describe('getAssetKey', () => {
  it('builds the S3 key from fileType + _id + name + extension, defaulting size to "preview"', () => {
    const key = getAssetKey({ fileType: 'image', _id: 'a1', name: 'photo', extension: 'jpg' });
    expect(key).toBe('assets/images/a1/preview/photo.jpg');
  });

  it('honours an explicit size', () => {
    const key = getAssetKey({ fileType: 'audio', _id: 'a1', name: 'clip', extension: 'mp3' }, 'original');
    expect(key).toBe('assets/audios/a1/original/clip.mp3');
  });

  it('rewrites gif → jpg for the placeholder size', () => {
    const key = getAssetKey({ fileType: 'image', _id: 'a1', name: 'logo', extension: 'gif' }, 'placeholder');
    expect(key).toBe('assets/images/a1/placeholder/logo.jpg');
  });

  it('rewrites gif → jpg for the preview size', () => {
    const key = getAssetKey({ fileType: 'image', _id: 'a1', name: 'logo', extension: 'gif' }, 'preview');
    expect(key).toBe('assets/images/a1/preview/logo.jpg');
  });

  it('keeps gif when the size is original', () => {
    const key = getAssetKey({ fileType: 'image', _id: 'a1', name: 'logo', extension: 'gif' }, 'original');
    expect(key).toBe('assets/images/a1/original/logo.gif');
  });
});
