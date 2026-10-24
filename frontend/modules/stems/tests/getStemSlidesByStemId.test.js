import { describe, it, expect, beforeEach } from 'vitest';
import getStemSlidesByStemId from '../helpers/getStemSlidesByStemId';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

const seedCache = (key, data) => {
  createCache({
    key,
    cache: { getInitialData: () => data },
    container: { props: {} }
  });
};

describe('getStemSlidesByStemId', () => {
  beforeEach(() => {
    resetCache('stems');
    resetCache('slides');
    seedCache('stems', [
      { _id: 'st1', ref: 'stem-1' },
      { _id: 'st2', ref: 'stem-2' }
    ]);
  });

  it('returns the slides belonging to the stem with the given id', () => {
    seedCache('slides', [
      { _id: 's1', stemRef: 'stem-1' },
      { _id: 's2', stemRef: 'stem-2' },
      { _id: 's3', stemRef: 'stem-1' }
    ]);

    expect(getStemSlidesByStemId({ stemId: 'st1' })).toEqual([
      { _id: 's1', stemRef: 'stem-1' },
      { _id: 's3', stemRef: 'stem-1' }
    ]);
  });

  it('returns an empty array when the stem has no slides', () => {
    seedCache('slides', [{ _id: 's1', stemRef: 'stem-1' }]);

    expect(getStemSlidesByStemId({ stemId: 'st2' })).toEqual([]);
  });

  it('returns an empty array when no stem matches the id', () => {
    seedCache('slides', [{ _id: 's1', stemRef: 'stem-1' }]);

    expect(getStemSlidesByStemId({ stemId: 'missing' })).toEqual([]);
  });

  it('does not match a stem by its ref', () => {
    seedCache('slides', [{ _id: 's1', stemRef: 'stem-1' }]);

    expect(getStemSlidesByStemId({ stemId: 'stem-1' })).toEqual([]);
  });
});
