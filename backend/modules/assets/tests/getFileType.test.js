import { describe, it, expect } from 'vitest';
import getFileType from '../helpers/getFileType.js';

describe('getFileType', () => {
  it('returns the prefix before the slash for any MIME type', () => {
    expect(getFileType('image/png')).toBe('image');
    expect(getFileType('audio/wav')).toBe('audio');
    expect(getFileType('video/mp4')).toBe('video');
    expect(getFileType('application/pdf')).toBe('application');
  });
});
