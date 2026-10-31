import { describe, it, expect, beforeEach } from 'vitest';
import getParentStems from '../helpers/getParentStems';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

const seedStems = (stems) => {
  createCache({
    key: 'stems',
    cache: { getInitialData: () => stems },
    container: { props: {} }
  });
};

const firstParentStem = { ref: 'parent-1', branchingOptions: [{ stemRef: 'shared' }] };
const secondParentStem = { ref: 'parent-2', branchingOptions: [{ stemRef: 'other' }, { stemRef: 'shared' }] };
const unrelatedStem = { ref: 'unrelated', branchingOptions: [{ stemRef: 'other' }] };

describe('getParentStems', () => {
  beforeEach(() => {
    resetCache('stems');
  });

  it('returns every stem that branches to the given stem', () => {
    seedStems([firstParentStem, secondParentStem, unrelatedStem, { ref: 'shared' }]);

    expect(getParentStems({ stem: { ref: 'shared' } })).toEqual([firstParentStem, secondParentStem]);
  });

  it('returns an empty array for a stem nothing branches to', () => {
    seedStems([firstParentStem, { ref: 'root', branchingOptions: [] }]);

    expect(getParentStems({ stem: { ref: 'root' } })).toEqual([]);
  });

  it('returns an empty array when no stem is given', () => {
    seedStems([firstParentStem]);

    expect(getParentStems({ stem: undefined })).toEqual([]);
  });
});
