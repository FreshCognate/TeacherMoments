import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import getScenarioDetails from '../helpers/getScenarioDetails';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

const seedSlides = (data) => {
  resetCache('slides');
  createCache({
    key: 'slides',
    cache: { getInitialData: () => data },
    container: { props: {} }
  });
};

const setSearch = (search) => {
  window.history.replaceState({}, '', `/${search}`);
};

describe('getScenarioDetails', () => {
  const originalUrl = window.location.href;

  beforeEach(() => {
    seedSlides([
      { _id: 'slide-1', ref: 'ref-1' },
      { _id: 'slide-2', ref: 'ref-2' }
    ]);
  });

  afterEach(() => {
    window.history.replaceState({}, '', originalUrl);
  });

  it('returns null id and ref when no slide query parameter is present', () => {
    setSearch('');
    expect(getScenarioDetails()).toEqual({
      activeSlideRef: null,
      activeSlideId: null
    });
  });

  it('maps CONSENT to itself for both ref and id', () => {
    setSearch('?slide=CONSENT');
    expect(getScenarioDetails()).toEqual({
      activeSlideRef: 'CONSENT',
      activeSlideId: 'CONSENT'
    });
  });

  it('maps SUMMARY to itself for both ref and id', () => {
    setSearch('?slide=SUMMARY');
    expect(getScenarioDetails()).toEqual({
      activeSlideRef: 'SUMMARY',
      activeSlideId: 'SUMMARY'
    });
  });

  it('resolves activeSlideId from the slides cache by ref', () => {
    setSearch('?slide=ref-2');
    expect(getScenarioDetails()).toEqual({
      activeSlideRef: 'ref-2',
      activeSlideId: 'slide-2'
    });
  });

  it('returns null activeSlideId when the ref does not match a slide', () => {
    setSearch('?slide=unknown');
    expect(getScenarioDetails()).toEqual({
      activeSlideRef: 'unknown',
      activeSlideId: null
    });
  });
});
