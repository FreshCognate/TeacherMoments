import { describe, it, expect, vi, beforeEach } from 'vitest';
import connections from '../connections.js';
import hasDatabaseConnection from '../middleware/hasDatabaseConnection.js';

const buildResponse = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe('hasDatabaseConnection middleware', () => {
  beforeEach(() => {
    Object.keys(connections).forEach((key) => delete connections[key]);
  });

  it('calls next when an app connection exists', async () => {
    connections.app = { connection: { name: 'mongo' } };
    const next = vi.fn();

    await hasDatabaseConnection({}, buildResponse(), next);

    expect(next).toHaveBeenCalled();
  });

  it('responds with 401 when there is no app connection', async () => {
    connections.app = { connection: null };
    const res = buildResponse();
    const next = vi.fn();

    await hasDatabaseConnection({}, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Unauthorised. Please login.',
      statusCode: 401
    });
  });
});
