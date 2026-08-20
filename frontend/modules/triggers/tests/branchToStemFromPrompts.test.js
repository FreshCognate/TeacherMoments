import { describe, it, expect, beforeEach } from 'vitest';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager.js';

import TRIGGERS from '../triggers';
import '../branchToStemFromPrompts.trigger.jsx';

const BranchToStemFromPrompts = TRIGGERS['BRANCH_TO_STEM_FROM_PROMPTS'];

const seedStems = (stems) => {
  createCache({
    key: 'stems',
    cache: { getInitialData: () => stems },
    container: { props: {} }
  });
};

const setActiveSlide = (slideRef) => {
  window.history.replaceState({}, '', `/scenarios/scenario-1/create?slide=${slideRef}`);
};

describe('branchToStemFromPrompts', () => {

  beforeEach(() => {
    resetCache('stems');
  });

  describe('isAvailable', () => {

    it('is available on a slide that branches into stems', () => {
      seedStems([{ ref: 'stem-1', slideRef: 'slide-1' }]);
      setActiveSlide('slide-1');

      expect(BranchToStemFromPrompts.isAvailable()).toBe(true);
    });

    it('is not available on a slide that has no stems', () => {
      seedStems([{ ref: 'stem-1', slideRef: 'another-slide' }]);
      setActiveSlide('slide-1');

      expect(BranchToStemFromPrompts.isAvailable()).toBe(false);
    });

    it('is not available when there are no stems at all', () => {
      seedStems([]);
      setActiveSlide('slide-1');

      expect(BranchToStemFromPrompts.isAvailable()).toBe(false);
    });

  });

});
