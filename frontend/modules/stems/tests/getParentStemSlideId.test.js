import { describe, it, expect, beforeEach, vi } from 'vitest';

const { getActiveStemRefMock } = vi.hoisted(() => ({ getActiveStemRefMock: vi.fn() }));

vi.mock('../helpers/getActiveStemRef', () => ({ default: () => getActiveStemRefMock() }));

import getParentStemSlideId from '../helpers/getParentStemSlideId';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

const seed = (key, data) => {
  resetCache(key);
  createCache({
    key,
    cache: { getInitialData: () => data },
    container: { props: {} }
  });
};

describe('getParentStemSlideId', () => {
  beforeEach(() => {
    seed('stems', [
      { ref: 'root-stem', isRoot: true, branchingOptions: [{ stemRef: 'child-stem', conditions: [] }] },
      { ref: 'child-stem' }
    ]);
    seed('slides', [
      { _id: 'root-slide-1', stemRef: 'root-stem' },
      { _id: 'root-slide-2', stemRef: 'root-stem' },
      { _id: 'child-slide-1', stemRef: 'child-stem' }
    ]);
  });

  it('returns the last slide of the parent stem', () => {
    getActiveStemRefMock.mockReturnValue('child-stem');
    seed('editor', {});
    expect(getParentStemSlideId()).toBe('root-slide-2');
  });

  it('returns the last slide of the parent stem the editor came through when a stem is shared', () => {
    seed('stems', [
      { ref: 'first-stem', branchingOptions: [{ stemRef: 'shared-stem', conditions: [] }] },
      { ref: 'second-stem', branchingOptions: [{ stemRef: 'shared-stem', conditions: [] }] },
      { ref: 'shared-stem' }
    ]);
    seed('slides', [
      { _id: 'first-slide-1', stemRef: 'first-stem' },
      { _id: 'second-slide-1', stemRef: 'second-stem' }
    ]);
    getActiveStemRefMock.mockReturnValue('shared-stem');
    seed('editor', { stemPath: ['root-stem', 'second-stem', 'shared-stem'] });
    expect(getParentStemSlideId()).toBe('second-slide-1');
  });

  it('falls back to the first parent stem when the editor path does not lead to the active stem', () => {
    seed('stems', [
      { ref: 'first-stem', branchingOptions: [{ stemRef: 'shared-stem', conditions: [] }] },
      { ref: 'second-stem', branchingOptions: [{ stemRef: 'shared-stem', conditions: [] }] },
      { ref: 'shared-stem' }
    ]);
    seed('slides', [
      { _id: 'first-slide-1', stemRef: 'first-stem' },
      { _id: 'second-slide-1', stemRef: 'second-stem' }
    ]);
    getActiveStemRefMock.mockReturnValue('shared-stem');
    seed('editor', { stemPath: ['unrelated-stem', 'shared-stem'] });
    expect(getParentStemSlideId()).toBe('first-slide-1');
  });

  it('returns undefined when the parent stem has no slides', () => {
    seed('slides', [{ _id: 'child-slide-1', stemRef: 'child-stem' }]);
    getActiveStemRefMock.mockReturnValue('child-stem');
    seed('editor', {});
    expect(getParentStemSlideId()).toBeUndefined();
  });

  it('returns undefined when the active stem has no parent', () => {
    getActiveStemRefMock.mockReturnValue('root-stem');
    seed('editor', {});
    expect(getParentStemSlideId()).toBeUndefined();
  });

  it('returns undefined when there is no active stem', () => {
    getActiveStemRefMock.mockReturnValue(null);
    seed('editor', {});
    expect(getParentStemSlideId()).toBeUndefined();
  });
});
