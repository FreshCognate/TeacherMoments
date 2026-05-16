import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import path from 'path';
import setGlobals from '../helpers/setGlobals.js';

describe('setGlobals', () => {
  let originalRoot;
  let originalApp;
  let originalEnv;
  let originalProtocol;
  let originalService;
  let originalNodeEnv;

  beforeEach(() => {
    originalRoot = global.root;
    originalApp = global.app;
    originalEnv = global.env;
    originalProtocol = global.protocol;
    originalService = global.service;
    originalNodeEnv = process.env.NODE_ENV;
  });

  afterEach(() => {
    global.root = originalRoot;
    global.app = originalApp;
    global.env = originalEnv;
    global.protocol = originalProtocol;
    global.service = originalService;
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('sets the root and app globals to the resolved cwd', () => {
    setGlobals('server');
    expect(global.root).toBe(path.resolve('./'));
    expect(global.app).toBe(`${path.resolve('./')}/app`);
  });

  it('uses NODE_ENV when set', () => {
    process.env.NODE_ENV = 'staging';
    setGlobals('server');
    expect(global.env).toBe('staging');
  });

  it('falls back to "development" when NODE_ENV is not set', () => {
    delete process.env.NODE_ENV;
    setGlobals('server');
    expect(global.env).toBe('development');
  });

  it('uses https as the protocol in production', () => {
    process.env.NODE_ENV = 'production';
    setGlobals('server');
    expect(global.protocol).toBe('https');
  });

  it('uses http as the protocol in non-production environments', () => {
    process.env.NODE_ENV = 'development';
    setGlobals('server');
    expect(global.protocol).toBe('http');
  });

  it('records the service name', () => {
    setGlobals('workers');
    expect(global.service).toBe('workers');
  });
});
