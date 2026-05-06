import { describe, it, expect } from 'vitest';
import getFileExtension from '../helpers/getFileExtension.js';

describe('getFileExtension', () => {
  it('maps known image MIME types', () => {
    expect(getFileExtension('image/jpg')).toBe('jpg');
    expect(getFileExtension('image/jpeg')).toBe('jpg');
    expect(getFileExtension('image/png')).toBe('png');
    expect(getFileExtension('image/gif')).toBe('gif');
    expect(getFileExtension('image/svg+xml')).toBe('svg');
    expect(getFileExtension('image/webp')).toBe('webp');
  });

  it('maps known audio MIME types', () => {
    expect(getFileExtension('audio/mpeg')).toBe('mp3');
    expect(getFileExtension('audio/m4a')).toBe('m4a');
    expect(getFileExtension('audio/ogg')).toBe('ogg');
    expect(getFileExtension('audio/wav')).toBe('wav');
  });

  it('maps known video MIME types', () => {
    expect(getFileExtension('video/mpeg')).toBe('mp4');
    expect(getFileExtension('video/mp4')).toBe('mp4');
  });

  it('returns undefined for unknown MIME types', () => {
    expect(getFileExtension('application/pdf')).toBeUndefined();
  });
});
