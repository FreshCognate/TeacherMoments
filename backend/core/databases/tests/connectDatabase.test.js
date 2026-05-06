import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { createConnectionMock, asPromiseMock, modelMock, getRegisteredModelsMock } = vi.hoisted(() => ({
  createConnectionMock: vi.fn(),
  asPromiseMock: vi.fn(),
  modelMock: vi.fn(),
  getRegisteredModelsMock: vi.fn()
}));

vi.mock('mongoose', () => ({
  default: { createConnection: (...args) => createConnectionMock(...args) }
}));

vi.mock('../helpers/getRegisteredModels.js', () => ({
  default: (...args) => getRegisteredModelsMock(...args)
}));

import connections from '../connections.js';
import connectDatabase from '../helpers/connectDatabase.js';

describe('connectDatabase', () => {
  let originalUrl;

  beforeEach(() => {
    Object.keys(connections).forEach((key) => delete connections[key]);
    originalUrl = process.env.MONGODB_URL;
    process.env.MONGODB_URL = 'mongodb://localhost:27017/test';
    vi.clearAllMocks();
    asPromiseMock.mockResolvedValue();
    createConnectionMock.mockReturnValue({
      asPromise: asPromiseMock,
      model: modelMock
    });
    getRegisteredModelsMock.mockReturnValue([]);
  });

  afterEach(() => {
    process.env.MONGODB_URL = originalUrl;
  });

  it('creates a mongoose connection from the configured MONGODB_URL', async () => {
    await connectDatabase();
    expect(createConnectionMock).toHaveBeenCalledWith('mongodb://localhost:27017/test', {});
  });

  it('stores the connection under the "app" key with a lastAccessed timestamp', async () => {
    await connectDatabase();

    expect(connections.app.connection).toBeDefined();
    expect(connections.app.lastAccessed).toBeInstanceOf(Date);
  });

  it('exposes a refresh() method that updates lastAccessed', async () => {
    await connectDatabase();
    const before = connections.app.lastAccessed;

    await new Promise((r) => setTimeout(r, 5));
    connections.app.connection.refresh();

    expect(connections.app.lastAccessed.getTime()).toBeGreaterThan(before.getTime());
  });

  it('registers each registered "app" model on the connection', async () => {
    getRegisteredModelsMock.mockReturnValue([
      { name: 'User', model: { schema: 'user' }, collection: 'users' },
      { name: 'Scenario', model: { schema: 'scenario' }, collection: 'scenarios' }
    ]);

    await connectDatabase();

    expect(getRegisteredModelsMock).toHaveBeenCalledWith('app');
    expect(modelMock).toHaveBeenCalledWith('User', { schema: 'user' }, 'users');
    expect(modelMock).toHaveBeenCalledWith('Scenario', { schema: 'scenario' }, 'scenarios');
  });

  it('awaits the connection being ready before returning', async () => {
    await connectDatabase();
    expect(asPromiseMock).toHaveBeenCalled();
  });

  it('returns the underlying mongoose connection', async () => {
    const result = await connectDatabase();
    expect(result).toBe(connections.app.connection);
  });
});
