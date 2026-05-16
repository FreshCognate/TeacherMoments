import { describe, it, expect, vi, beforeEach } from 'vitest';
import generateRandomUsername from '../helpers/generateRandomUsername.js';

describe('generateRandomUsername', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns the first generated username when it is unique', async () => {
    const findOne = vi.fn().mockResolvedValue(null);
    const username = await generateRandomUsername({ findOne });

    expect(username).toMatch(/^(a|an)-[a-z]+-[a-z]+$/);
    expect(findOne).toHaveBeenCalledTimes(1);
  });

  it('keeps trying when usernames collide', async () => {
    const findOne = vi.fn()
      .mockResolvedValueOnce({ _id: 'taken-1' })
      .mockResolvedValueOnce({ _id: 'taken-2' })
      .mockResolvedValueOnce(null);

    const username = await generateRandomUsername({ findOne });
    expect(username).toBeTruthy();
    expect(findOne).toHaveBeenCalledTimes(3);
  });

  it('appends a numeric suffix once 5+ attempts have been made', async () => {
    const findOne = vi.fn()
      .mockResolvedValueOnce({ _id: 'a' })
      .mockResolvedValueOnce({ _id: 'b' })
      .mockResolvedValueOnce({ _id: 'c' })
      .mockResolvedValueOnce({ _id: 'd' })
      .mockResolvedValueOnce({ _id: 'e' })
      .mockResolvedValueOnce(null);

    const username = await generateRandomUsername({ findOne });
    expect(username).toMatch(/^(a|an)-[a-z]+-[a-z]+-\d{2}$/);
  });

  it('throws 500 after 10 failed attempts', async () => {
    const findOne = vi.fn().mockResolvedValue({ _id: 'always-taken' });

    await expect(generateRandomUsername({ findOne })).rejects.toMatchObject({
      statusCode: 500,
      message: expect.stringContaining('Unable to generate a unique username')
    });
    expect(findOne).toHaveBeenCalledTimes(10);
  });
});
