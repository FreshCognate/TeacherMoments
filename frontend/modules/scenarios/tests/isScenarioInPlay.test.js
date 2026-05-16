import { describe, it, expect, afterEach } from 'vitest';
import isScenarioInPlay from '../helpers/isScenarioInPlay';

const setPathname = (pathname) => {
  window.history.replaceState({}, '', pathname);
};

describe('isScenarioInPlay', () => {
  const originalUrl = window.location.href;

  afterEach(() => {
    window.history.replaceState({}, '', originalUrl);
  });

  it('returns true when the first path segment is "play"', () => {
    setPathname('/play/scenario-1');
    expect(isScenarioInPlay()).toBe(true);
  });

  it('returns false on the create path', () => {
    setPathname('/scenarios/scenario-1/create');
    expect(isScenarioInPlay()).toBe(false);
  });

  it('returns false on the root path', () => {
    setPathname('/');
    expect(isScenarioInPlay()).toBe(false);
  });
});
