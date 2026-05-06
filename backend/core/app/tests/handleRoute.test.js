import { describe, it, expect, vi, beforeEach } from 'vitest';

const getModelsAndTenantMock = vi.fn();
const getConnectionMock = vi.fn();

vi.mock('#core/databases/helpers/getModelsAndTenant.js', () => ({
  default: (...args) => getModelsAndTenantMock(...args)
}));

vi.mock('#core/databases/helpers/getConnection.js', () => ({
  default: (...args) => getConnectionMock(...args)
}));

import handleRoute from '../helpers/handleRoute.js';

const buildResponse = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

const buildRequest = (overrides = {}) => ({
  params: {},
  body: {},
  query: {},
  files: {},
  user: { _id: 'user-1' },
  ...overrides
});

describe('handleRoute', () => {
  let consoleWarnSpy;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    getModelsAndTenantMock.mockResolvedValue({ models: { User: {} }, tenant: 'tenant-1' });
    getConnectionMock.mockReturnValue({ connection: 'mongo' });
  });

  it('passes the param value when a param name is configured', async () => {
    const method = vi.fn().mockResolvedValue({ ok: true });
    const handler = handleRoute({ param: 'id', bodyArguments: {}, queryArguments: {}, filesArguments: {}, props: {}, method });

    await handler(buildRequest({ params: { id: 'abc' } }), buildResponse(), vi.fn());

    expect(method).toHaveBeenCalledWith(
      expect.objectContaining({ param: 'abc' }),
      expect.any(Object)
    );
  });

  it('picks only the configured body keys', async () => {
    const method = vi.fn().mockResolvedValue({});
    const handler = handleRoute({
      param: null,
      bodyArguments: { name: true },
      queryArguments: {},
      filesArguments: {},
      props: {},
      method
    });

    await handler(
      buildRequest({ body: { name: 'Sam', extra: 'not allowed' } }),
      buildResponse(),
      vi.fn()
    );

    expect(method).toHaveBeenCalledWith(
      expect.objectContaining({ body: { name: 'Sam' } }),
      expect.any(Object)
    );
    expect(method.mock.calls[0][0].body.extra).toBeUndefined();
  });

  it('picks only the configured query keys', async () => {
    const method = vi.fn().mockResolvedValue({});
    const handler = handleRoute({
      param: null,
      bodyArguments: {},
      queryArguments: { page: true },
      filesArguments: {},
      props: {},
      method
    });

    await handler(buildRequest({ query: { page: 2, secret: 'oops' } }), buildResponse(), vi.fn());

    expect(method.mock.calls[0][0].query).toEqual({ page: 2 });
  });

  it('passes models, tenant, req, res, user, and connection in the second argument', async () => {
    const method = vi.fn().mockResolvedValue({ ok: true });
    const handler = handleRoute({ param: null, bodyArguments: {}, queryArguments: {}, filesArguments: {}, props: {}, method });

    const req = buildRequest();
    const res = buildResponse();
    await handler(req, res, vi.fn());

    expect(method).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        models: { User: {} },
        tenant: 'tenant-1',
        req,
        res,
        user: { _id: 'user-1' },
        connection: { connection: 'mongo' }
      })
    );
  });

  it('responds with the controller result via res.json', async () => {
    const method = vi.fn().mockResolvedValue({ result: 'ok' });
    const handler = handleRoute({ param: null, bodyArguments: {}, queryArguments: {}, filesArguments: {}, props: {}, method });
    const res = buildResponse();

    await handler(buildRequest(), res, vi.fn());

    expect(res.json).toHaveBeenCalledWith({ result: 'ok' });
  });

  it('returns 500 with the error message when the controller throws without a statusCode', async () => {
    const method = vi.fn().mockRejectedValue(new Error('boom'));
    const handler = handleRoute({ param: null, bodyArguments: {}, queryArguments: {}, filesArguments: {}, props: {}, method });
    const res = buildResponse();

    await handler(buildRequest(), res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'boom' });
  });

  it('returns the configured statusCode when the controller throws with one', async () => {
    const error = { statusCode: 404, message: 'Not Found' };
    const method = vi.fn().mockRejectedValue(error);
    const handler = handleRoute({ param: null, bodyArguments: {}, queryArguments: {}, filesArguments: {}, props: {}, method });
    const res = buildResponse();

    await handler(buildRequest(), res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(error);
  });

  it('passes props through to the controller', async () => {
    const method = vi.fn().mockResolvedValue({});
    const handler = handleRoute({
      param: null,
      bodyArguments: {},
      queryArguments: {},
      filesArguments: {},
      props: { customProp: 'value' },
      method
    });

    await handler(buildRequest(), buildResponse(), vi.fn());

    expect(method.mock.calls[0][0].props).toEqual({ customProp: 'value' });
  });
});
