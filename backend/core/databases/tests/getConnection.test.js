import { describe, it, expect, beforeEach } from 'vitest';
import connections from '../connections.js';
import getConnection from '../helpers/getConnection.js';

describe('getConnection', () => {
  beforeEach(() => {
    Object.keys(connections).forEach((key) => delete connections[key]);
  });

  it('returns the underlying mongoose connection from the app entry', () => {
    const fakeConnection = { name: 'mongo' };
    connections.app = { connection: fakeConnection };

    expect(getConnection()).toBe(fakeConnection);
  });
});
