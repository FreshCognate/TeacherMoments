import { describe, it, expect } from 'vitest';
import getUrl from './getUrl.js';

describe('getUrl', () => {
  it('returns null when no url is provided', () => {
    expect(getUrl({ url: null })).toBeNull();
    expect(getUrl({})).toBeNull();
  });

  it('returns the url unchanged when no params are provided', () => {
    expect(getUrl({ url: '/scenarios' })).toBe('/scenarios');
  });

  it('replaces a single :param placeholder with the provided value', () => {
    expect(getUrl({ url: '/scenarios/:id', params: { id: 'abc' } })).toBe('/scenarios/abc');
  });

  it('replaces multiple placeholders', () => {
    expect(
      getUrl({
        url: '/cohorts/:cohortId/scenarios/:scenarioId',
        params: { cohortId: 'c1', scenarioId: 's1' }
      })
    ).toBe('/cohorts/c1/scenarios/s1');
  });

  it('leaves placeholders unchanged when their key is not provided in params', () => {
    expect(getUrl({ url: '/scenarios/:id', params: { other: 'x' } })).toBe('/scenarios/:id');
  });
});
