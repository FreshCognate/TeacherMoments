import { describe, it, expect, beforeEach } from 'vitest';
import QUEUES from '../queues.js';
import getQueue from '../helpers/getQueue.js';

describe('getQueue', () => {
  beforeEach(() => {
    Object.keys(QUEUES).forEach((key) => delete QUEUES[key]);
  });

  it('returns the entire QUEUES dictionary when no name is given', () => {
    QUEUES.generate = { name: 'generate' };
    QUEUES.assets = { name: 'assets' };

    expect(getQueue()).toBe(QUEUES);
  });

  it('returns the named queue', () => {
    const queue = { name: 'generate' };
    QUEUES.generate = queue;

    expect(getQueue('generate')).toBe(queue);
  });

  it('returns undefined for an unknown queue name', () => {
    expect(getQueue('missing')).toBeUndefined();
  });
});
