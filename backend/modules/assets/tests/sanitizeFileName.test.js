import { describe, it, expect } from 'vitest';
import sanitizeFileName from '../helpers/sanitizeFileName.js';

describe('sanitizeFileName', () => {
  it('preserves safe characters (letters, numbers, dashes, underscores, periods)', () => {
    expect(sanitizeFileName('file_name-1.txt')).toBe('file_name-1.txt');
  });

  it('replaces unsafe characters with underscores', () => {
    expect(sanitizeFileName('hello world.png')).toBe('hello_world.png');
    expect(sanitizeFileName('file@name#1.jpg')).toBe('file_name_1.jpg');
  });

  it('strips leading and trailing dots', () => {
    expect(sanitizeFileName('...file.txt...')).toBe('file.txt');
  });

  it('replaces spaces with underscores rather than stripping them (since the unsafe-char step runs first)', () => {
    expect(sanitizeFileName('  file.txt  ')).toBe('__file.txt__');
  });

  it('decomposes accented characters via NFKD and replaces the combining mark', () => {
    expect(sanitizeFileName('éfile.txt')).toBe('e_file.txt');
  });

  it('truncates to 255 characters', () => {
    const longName = 'a'.repeat(300) + '.txt';
    const result = sanitizeFileName(longName);
    expect(result.length).toBe(255);
  });
});
