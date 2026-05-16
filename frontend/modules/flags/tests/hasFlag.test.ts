import { describe, it, expect, afterEach } from 'vitest';
import hasFlag from '../helpers/hasFlag';

const originalLocation = window.location;

const setHostname = (hostname: string) => {
  Object.defineProperty(window, 'location', {
    value: { ...window.location, hostname },
    writable: true,
    configurable: true
  });
};

describe('hasFlag', () => {
  afterEach(() => {
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
      configurable: true
    });
  });

  it('returns true on mit-tm.com', () => {
    setHostname('mit-tm.com');
    expect(hasFlag()).toBe(true);
  });

  it('returns true on staging.teachermoments.org', () => {
    setHostname('staging.teachermoments.org');
    expect(hasFlag()).toBe(true);
  });

  it('returns false on teachermoments.org', () => {
    setHostname('teachermoments.org');
    expect(hasFlag()).toBe(false);
  });

  it('returns false on localhost', () => {
    setHostname('localhost');
    expect(hasFlag()).toBe(false);
  });
});
