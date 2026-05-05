import { describe, it, expect, vi, afterEach } from 'vitest';
import disconnectSockets from './disconnectSockets.js';
import SOCKETS from '../sockets.js';

describe('disconnectSockets', () => {
  afterEach(() => {
    SOCKETS.connection = null;
  });

  it('does nothing when there is no active connection', () => {
    SOCKETS.connection = null;
    expect(() => disconnectSockets()).not.toThrow();
    expect(SOCKETS.connection).toBeNull();
  });

  it('removes all listeners, disconnects, and clears the connection slot', () => {
    const removeAllListeners = vi.fn();
    const disconnect = vi.fn();
    SOCKETS.connection = { removeAllListeners, disconnect };

    disconnectSockets();

    expect(removeAllListeners).toHaveBeenCalledTimes(1);
    expect(disconnect).toHaveBeenCalledTimes(1);
    expect(SOCKETS.connection).toBeNull();
  });
});
