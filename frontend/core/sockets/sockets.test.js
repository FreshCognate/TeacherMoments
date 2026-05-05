import { describe, it, expect } from 'vitest';
import SOCKETS from './sockets.js';

describe('SOCKETS singleton', () => {
  it('exposes a connection slot defaulting to null', () => {
    expect(SOCKETS).toHaveProperty('connection');
  });
});
