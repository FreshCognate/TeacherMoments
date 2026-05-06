import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import getSockets from '../helpers/getSockets.js';
import SOCKETS from '../sockets.js';

describe('getSockets', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    SOCKETS.connection = null;
  });

  afterEach(() => {
    vi.useRealTimers();
    SOCKETS.connection = null;
  });

  it('resolves immediately with the connection when one is already set', async () => {
    const connection = { id: 'sock' };
    SOCKETS.connection = connection;

    await expect(getSockets()).resolves.toBe(connection);
  });

  it('polls every 100ms until a connection is set, then resolves', async () => {
    const promise = getSockets();

    await vi.advanceTimersByTimeAsync(250);
    SOCKETS.connection = { id: 'sock' };
    await vi.advanceTimersByTimeAsync(100);

    await expect(promise).resolves.toEqual({ id: 'sock' });
  });
});
