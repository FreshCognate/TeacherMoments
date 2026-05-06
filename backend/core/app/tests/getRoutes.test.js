import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const {
  corsMarker,
  corsMock,
  rateLimitMarker,
  rateLimitMock,
  validationMarker,
  handleValidationMock,
  routeMarker,
  handleRouteMock
} = vi.hoisted(() => {
  const corsMarker = Symbol('cors-middleware');
  const rateLimitMarker = Symbol('rate-limit-middleware');
  const validationMarker = Symbol('validation-middleware');
  const routeMarker = Symbol('route-middleware');
  return {
    corsMarker,
    corsMock: vi.fn(() => corsMarker),
    rateLimitMarker,
    rateLimitMock: vi.fn(() => rateLimitMarker),
    validationMarker,
    handleValidationMock: vi.fn(() => validationMarker),
    routeMarker,
    handleRouteMock: vi.fn(() => routeMarker)
  };
});

vi.mock('cors', () => ({ default: corsMock }));
vi.mock('express-rate-limit', () => ({ default: rateLimitMock }));
vi.mock('../helpers/handleValidation.js', () => ({ default: (...args) => handleValidationMock(...args) }));
vi.mock('../helpers/handleRoute.js', () => ({ default: (...args) => handleRouteMock(...args) }));

import ROUTES from '../app.routes.js';
import getRoutes from '../helpers/getRoutes.js';

const buildApp = () => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  options: vi.fn()
});

const baseRoute = (overrides) => ({
  route: '/things',
  controller: {
    all: vi.fn(),
    create: vi.fn(),
    read: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  },
  ...overrides
});

const buildMethodConfig = (overrides = {}) => ({
  param: '',
  body: {},
  query: {},
  files: {},
  middleware: [],
  props: {},
  hasCors: false,
  shouldSkipValidation: false,
  shouldSkipRateLimit: false,
  rateLimit: 2000,
  ...overrides
});

describe('getRoutes', () => {
  let originalApiPrefix;

  beforeEach(() => {
    vi.clearAllMocks();
    originalApiPrefix = process.env.API_PREFIX;
    process.env.API_PREFIX = '/api';
    ROUTES.length = 0;
  });

  afterEach(() => {
    process.env.API_PREFIX = originalApiPrefix;
    ROUTES.length = 0;
  });

  it('does not register a route that has no controller', () => {
    ROUTES.push({ route: '/orphan', all: buildMethodConfig() });
    const app = buildApp();
    getRoutes(app);
    expect(app.get).not.toHaveBeenCalled();
  });

  describe('HTTP method mapping', () => {
    it('maps "all" to GET on /api/<route>', () => {
      ROUTES.push(baseRoute({ all: buildMethodConfig() }));
      const app = buildApp();
      getRoutes(app);

      expect(app.get.mock.calls[0][0]).toBe('/api/things');
    });

    it('maps "create" to POST on /api/<route>', () => {
      ROUTES.push(baseRoute({ create: buildMethodConfig() }));
      const app = buildApp();
      getRoutes(app);
      expect(app.post.mock.calls[0][0]).toBe('/api/things');
    });

    it('maps "read" to GET on /api/<route>/:param', () => {
      ROUTES.push(baseRoute({ read: buildMethodConfig({ param: 'id' }) }));
      const app = buildApp();
      getRoutes(app);
      expect(app.get.mock.calls[0][0]).toBe('/api/things/:id');
    });

    it('maps "update" to PUT on /api/<route>/:param', () => {
      ROUTES.push(baseRoute({ update: buildMethodConfig({ param: 'id' }) }));
      const app = buildApp();
      getRoutes(app);
      expect(app.put.mock.calls[0][0]).toBe('/api/things/:id');
    });

    it('maps "delete" to DELETE on /api/<route>/:param', () => {
      ROUTES.push(baseRoute({ delete: buildMethodConfig({ param: 'id' }) }));
      const app = buildApp();
      getRoutes(app);
      expect(app.delete.mock.calls[0][0]).toBe('/api/things/:id');
    });
  });

  describe('middleware chain', () => {
    it('registers cors, rate limit, route middleware, validation, and handler in order', () => {
      const customMiddleware = vi.fn();
      ROUTES.push(baseRoute({
        all: buildMethodConfig({ middleware: [customMiddleware] })
      }));

      const app = buildApp();
      getRoutes(app);

      const handlers = app.get.mock.calls[0].slice(1);
      expect(handlers).toEqual([
        corsMarker,
        rateLimitMarker,
        customMiddleware,
        validationMarker,
        routeMarker
      ]);
    });

    it('registers an OPTIONS preflight when hasCors is true', () => {
      ROUTES.push(baseRoute({
        all: buildMethodConfig({ hasCors: true })
      }));

      const app = buildApp();
      getRoutes(app);

      expect(app.options).toHaveBeenCalledWith('/api/things', corsMarker);
    });

    it('does not register an OPTIONS preflight when hasCors is false', () => {
      ROUTES.push(baseRoute({
        all: buildMethodConfig({ hasCors: false })
      }));

      const app = buildApp();
      getRoutes(app);

      expect(app.options).not.toHaveBeenCalled();
    });
  });

  describe('rate limit window', () => {
    it('uses a 15-minute window when the rate limit is 5 or fewer', () => {
      ROUTES.push(baseRoute({
        create: buildMethodConfig({ rateLimit: 5 })
      }));

      const app = buildApp();
      getRoutes(app);

      const config = rateLimitMock.mock.calls.at(-1)[0];
      expect(config.windowMs).toBe(15 * 60 * 1000);
      expect(config.limit).toBe(5);
    });

    it('uses a 1-minute window when the rate limit is above 5', () => {
      ROUTES.push(baseRoute({
        create: buildMethodConfig({ rateLimit: 200 })
      }));

      const app = buildApp();
      getRoutes(app);

      const config = rateLimitMock.mock.calls.at(-1)[0];
      expect(config.windowMs).toBe(60 * 1000);
      expect(config.limit).toBe(200);
    });

    it('skips rate limiting when shouldSkipRateLimit is true', () => {
      ROUTES.push(baseRoute({
        create: buildMethodConfig({ shouldSkipRateLimit: true })
      }));

      const app = buildApp();
      getRoutes(app);

      const config = rateLimitMock.mock.calls.at(-1)[0];
      expect(config.skip()).toBe(true);
    });

    it('responds with 429-shaped JSON when the rate limit is hit', () => {
      ROUTES.push(baseRoute({ create: buildMethodConfig() }));
      const app = buildApp();
      getRoutes(app);

      const config = rateLimitMock.mock.calls.at(-1)[0];
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const options = { statusCode: 429 };

      config.handler({}, res, vi.fn(), options);

      expect(res.status).toHaveBeenCalledWith(429);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Too many requests, please try again later.',
        statusCode: 429
      });
    });
  });

  it('registers all five HTTP methods when present on the same route', () => {
    ROUTES.push(baseRoute({
      all: buildMethodConfig(),
      create: buildMethodConfig(),
      read: buildMethodConfig({ param: 'id' }),
      update: buildMethodConfig({ param: 'id' }),
      delete: buildMethodConfig({ param: 'id' })
    }));

    const app = buildApp();
    getRoutes(app);

    expect(app.get).toHaveBeenCalledTimes(2);
    expect(app.post).toHaveBeenCalledTimes(1);
    expect(app.put).toHaveBeenCalledTimes(1);
    expect(app.delete).toHaveBeenCalledTimes(1);
  });
});
