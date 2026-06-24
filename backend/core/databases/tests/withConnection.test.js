import { describe, it, expect, vi, beforeEach } from 'vitest';

const { connectDatabaseMock, closeMock } = vi.hoisted(() => ({
  connectDatabaseMock: vi.fn(),
  closeMock: vi.fn()
}));

vi.mock('../helpers/connectDatabase.js', () => ({
  default: (...args) => connectDatabaseMock(...args)
}));

import withConnection from '../helpers/withConnection.js';

const models = { Asset: {} };

describe('withConnection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    closeMock.mockResolvedValue();
    connectDatabaseMock.mockResolvedValue({ models, close: closeMock });
  });

  it('passes the connection to the work callback', async () => {
    const work = vi.fn().mockResolvedValue();
    await withConnection(work);
    expect(work).toHaveBeenCalledWith(expect.objectContaining({ models, close: closeMock }));
  });

  it('returns the value produced by the work callback', async () => {
    const result = await withConnection(async () => 'done');
    expect(result).toBe('done');
  });

  it('closes the connection after the work completes', async () => {
    await withConnection(async () => {});
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it('closes the connection even when the work throws, and rethrows', async () => {
    const boom = new Error('boom');
    await expect(withConnection(async () => { throw boom; })).rejects.toBe(boom);
    expect(closeMock).toHaveBeenCalledTimes(1);
  });
});
