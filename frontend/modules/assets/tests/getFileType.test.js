import { describe, it, expect } from 'vitest';
import getFileType from '../helpers/getFileType.js';

describe('getFileType', () => {
  it('returns "image" for image MIME types', () => {
    expect(getFileType({ type: 'image/png' })).toBe('image');
    expect(getFileType({ type: 'image/jpeg' })).toBe('image');
  });

  it('returns "video" for video MIME types', () => {
    expect(getFileType({ type: 'video/mp4' })).toBe('video');
  });

  it('returns "audio" for audio MIME types', () => {
    expect(getFileType({ type: 'audio/mpeg' })).toBe('audio');
  });

  it('returns the prefix portion before the slash', () => {
    expect(getFileType({ type: 'application/pdf' })).toBe('application');
  });
});
