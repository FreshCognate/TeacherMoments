import { describe, it, expect, vi } from 'vitest';
import getPublishLink from '../helpers/getPublishLink.js';

describe('getPublishLink', () => {
  it('slugifies the name (lowercase, strict) and returns it when unique', async () => {
    const findOne = vi.fn().mockResolvedValue(null);
    const result = await getPublishLink({ name: 'Hello World!', Model: { findOne } });

    expect(result).toBe('hello-world');
    expect(findOne).toHaveBeenCalledWith({ publishLink: 'hello-world' });
  });

  it('truncates the name to 38 characters before slugifying', async () => {
    const findOne = vi.fn().mockResolvedValue(null);
    const long = 'a'.repeat(50);
    const result = await getPublishLink({ name: long, Model: { findOne } });
    expect(result.length).toBeLessThanOrEqual(38);
  });

  it('appends a suffix when the slug already exists', async () => {
    const findOne = vi.fn()
      .mockResolvedValueOnce({ _id: 'taken' })
      .mockResolvedValueOnce(null);

    const result = await getPublishLink({ name: 'Hello', Model: { findOne } });

    expect(result).toBe('hello-1');
    expect(findOne).toHaveBeenNthCalledWith(1, { publishLink: 'hello' });
    expect(findOne).toHaveBeenNthCalledWith(2, { publishLink: 'hello-1' });
  });

  it('increments the suffix until a unique slug is found', async () => {
    const findOne = vi.fn()
      .mockResolvedValueOnce({ _id: 't' })
      .mockResolvedValueOnce({ _id: 't' })
      .mockResolvedValueOnce({ _id: 't' })
      .mockResolvedValueOnce(null);

    const result = await getPublishLink({ name: 'Hello', Model: { findOne } });

    expect(result).toBe('hello-3');
  });
});
