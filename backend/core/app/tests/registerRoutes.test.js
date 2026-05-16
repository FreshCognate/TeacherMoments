import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import ROUTES from '../app.routes.js';
import registerRoutes from '../helpers/registerRoutes.js';

describe('registerRoutes', () => {
  let originalService;

  beforeEach(() => {
    originalService = global.service;
    delete global.service;
    ROUTES.length = 0;
  });

  afterEach(() => {
    global.service = originalService;
    ROUTES.length = 0;
  });

  it('registers a single route object', () => {
    registerRoutes({ route: '/things', controller: {}, all: {} });
    expect(ROUTES).toHaveLength(1);
    expect(ROUTES[0].route).toBe('/things');
  });

  it('registers each route when given an array', () => {
    registerRoutes([
      { route: '/a', controller: {}, all: {} },
      { route: '/b', controller: {}, all: {} }
    ]);
    expect(ROUTES.map((r) => r.route)).toEqual(['/a', '/b']);
  });

  it('skips registration when running as the workers service', () => {
    global.service = 'workers';
    registerRoutes({ route: '/things', controller: {}, all: {} });
    expect(ROUTES).toHaveLength(0);
  });

  describe('default values', () => {
    it('fills in defaults for missing fields on each registered method', () => {
      registerRoutes({ route: '/things', controller: {}, all: {} });
      const all = ROUTES[0].all;
      expect(all).toMatchObject({
        param: '',
        body: {},
        query: {},
        files: {},
        middleware: [],
        props: {},
        hasCors: false,
        shouldSkipValidation: false,
        shouldSkipRateLimit: false
      });
    });

    it('keeps user-provided values rather than overriding them', () => {
      const middleware = [() => {}];
      registerRoutes({
        route: '/things',
        controller: {},
        all: {
          param: 'id',
          middleware,
          shouldSkipValidation: true,
          hasCors: true
        }
      });
      const all = ROUTES[0].all;
      expect(all.param).toBe('id');
      expect(all.middleware).toBe(middleware);
      expect(all.shouldSkipValidation).toBe(true);
      expect(all.hasCors).toBe(true);
    });

    it('uses 2000 rate limit for "all" methods by default', () => {
      registerRoutes({ route: '/things', controller: {}, all: {} });
      expect(ROUTES[0].all.rateLimit).toBe(2000);
    });

    it('uses 2000 rate limit for "read" methods by default', () => {
      registerRoutes({ route: '/things', controller: {}, read: {} });
      expect(ROUTES[0].read.rateLimit).toBe(2000);
    });

    it('uses 200 rate limit for write methods (create/update/delete) by default', () => {
      registerRoutes({
        route: '/things',
        controller: {},
        create: {},
        update: {},
        delete: {}
      });
      expect(ROUTES[0].create.rateLimit).toBe(200);
      expect(ROUTES[0].update.rateLimit).toBe(200);
      expect(ROUTES[0].delete.rateLimit).toBe(200);
    });

    it('respects an explicit rateLimit override', () => {
      registerRoutes({ route: '/things', controller: {}, all: { rateLimit: 5 } });
      expect(ROUTES[0].all.rateLimit).toBe(5);
    });
  });
});
