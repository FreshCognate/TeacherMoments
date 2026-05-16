import { describe, it, expect } from 'vitest';
import getFileUploadAccepts from '../helpers/getFileUploadAccepts.js';

describe('getFileUploadAccepts', () => {
  it('returns an empty object when no file types are provided', () => {
    expect(getFileUploadAccepts([])).toEqual({});
  });

  it('returns image MIME types when "image" is requested', () => {
    const accepts = getFileUploadAccepts(['image']);
    expect(accepts).toHaveProperty('image/png');
    expect(accepts).toHaveProperty('image/jpeg');
    expect(accepts).toHaveProperty('image/gif');
    expect(accepts).toHaveProperty('image/svg+xml');
    expect(accepts).toHaveProperty('image/webp');
  });

  it('combines multiple file types into a single accepts object', () => {
    const accepts = getFileUploadAccepts(['image', 'audio']);
    expect(accepts).toHaveProperty('image/png');
    expect(accepts).toHaveProperty('audio/mpeg');
  });

  it('returns video MIME types when "video" is requested', () => {
    const accepts = getFileUploadAccepts(['video']);
    expect(accepts).toHaveProperty('video/mp4');
    expect(accepts).toHaveProperty('video/mpeg');
  });
});
