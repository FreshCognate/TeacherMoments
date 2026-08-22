import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager.js';

const setSlideStatusMock = vi.fn();
const setSlideTriggerMock = vi.fn();
const setSlideNavigationMock = vi.fn();
const navigateToMock = vi.fn();
const getBlockTrackingMock = vi.fn();
const generateMock = vi.fn();

vi.mock('../../run/helpers/setSlideStatus', () => ({ default: (...args) => setSlideStatusMock(...args) }));
vi.mock('../../run/helpers/setSlideTrigger', () => ({ default: (...args) => setSlideTriggerMock(...args) }));
vi.mock('../../run/helpers/setSlideNavigation', () => ({ default: (...args) => setSlideNavigationMock(...args) }));
vi.mock('../../run/helpers/navigateTo', () => ({ default: (...args) => navigateToMock(...args) }));
vi.mock('../../run/helpers/getBlockTracking', () => ({ default: (...args) => getBlockTrackingMock(...args) }));
vi.mock('../../generate/helpers/generate', () => ({ default: (...args) => generateMock(...args) }));

import TRIGGERS from '../triggers';
import '../branchToStemFromPrompts.trigger.jsx';

const BranchToStemFromPrompts = TRIGGERS['BRANCH_TO_STEM_FROM_PROMPTS'];

const seedCache = (key, data) => {
  createCache({
    key,
    cache: { getInitialData: () => data },
    container: { props: {} }
  });
};

const seedStems = (stems) => seedCache('stems', stems);

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

  describe('getSchema', () => {

    const stemA = { ref: 'stem-a', name: 'A', slideRef: 'slide-1', sortOrder: 0 };
    const stemB = { ref: 'stem-b', name: 'B', slideRef: 'slide-1', sortOrder: 1 };

    const trigger = (items) => ({ elementRef: 'slide-1', items });

    it('hides the default stem while a stem has no conditions', () => {
      seedStems([stemA, stemB]);

      const schema = BranchToStemFromPrompts.getSchema(trigger([
        { elementRef: 'stem-a', conditions: [{ prompts: [{ ref: 'block-1', text: 'yes' }] }] }
      ]));

      expect(schema.items).toBeDefined();
      expect(schema.defaultStemRef).toBeUndefined();
    });

    it('shows the default stem once every stem has conditions', () => {
      seedStems([stemA, stemB]);

      const schema = BranchToStemFromPrompts.getSchema(trigger([
        { elementRef: 'stem-a', conditions: [{ prompts: [{ ref: 'block-1', text: 'yes' }] }] },
        { elementRef: 'stem-b', conditions: [{ prompts: [{ ref: 'block-1', text: 'yes' }] }] }
      ]));

      expect(schema.defaultStemRef.type).toBe('Select');
      expect(schema.defaultStemRef.options).toEqual([
        { value: '', text: 'None' },
        { value: 'stem-a', text: 'A' },
        { value: 'stem-b', text: 'B' }
      ]);
    });

    it('hides the default stem when an item exists but its conditions were removed', () => {
      seedStems([stemA, stemB]);

      const schema = BranchToStemFromPrompts.getSchema(trigger([
        { elementRef: 'stem-a', conditions: [{ prompts: [{ ref: 'block-1', text: 'yes' }] }] },
        { elementRef: 'stem-b', conditions: [] }
      ]));

      expect(schema.defaultStemRef).toBeUndefined();
    });

  });

  describe('trigger navigation', () => {

    const stemA = { _id: 'sa', ref: 'stem-a', name: 'A', slideRef: 'slide-1', sortOrder: 0 };
    const stemB = { _id: 'sb', ref: 'stem-b', name: 'B', slideRef: 'slide-1', sortOrder: 1 };
    const stemC = { _id: 'sc', ref: 'stem-c', name: 'C', slideRef: 'slide-1', sortOrder: 2 };

    const router = { navigate: vi.fn() };

    const conditionOn = (options) => ({
      _id: 'c1',
      prompts: [{ ref: 'block-1', options }]
    });

    const runTrigger = (overrides) => BranchToStemFromPrompts.trigger({
      ref: 'trigger-1',
      elementRef: 'slide-1',
      items: [],
      ...overrides
    }, router);

    beforeEach(() => {
      vi.clearAllMocks();
      resetCache('blocks');
      resetCache('slides');
      resetCache('app');

      seedCache('app', { language: 'en-US' });

      seedCache('blocks', [
        { _id: 'b1', ref: 'block-1', slideRef: 'slide-1', blockType: 'MULTIPLE_CHOICE_PROMPT' }
      ]);
      seedCache('slides', [
        { _id: 'sl-a', ref: 'slide-a', stemRef: 'stem-a' },
        { _id: 'sl-b', ref: 'slide-b', stemRef: 'stem-b' },
        { _id: 'sl-c', ref: 'slide-c', stemRef: 'stem-c' }
      ]);

      getBlockTrackingMock.mockReturnValue({ selectedOptions: ['no-match'], textValue: '' });
    });

    it('navigates to the stem whose condition matches', async () => {
      seedStems([stemA, stemB]);
      getBlockTrackingMock.mockReturnValue({ selectedOptions: ['yes'], textValue: '' });

      await runTrigger({
        defaultStemRef: 'stem-b',
        items: [
          { _id: 'i1', elementRef: 'stem-a', conditions: [conditionOn(['yes'])] },
          { _id: 'i2', elementRef: 'stem-b', conditions: [conditionOn(['other'])] }
        ]
      });

      expect(navigateToMock).toHaveBeenCalledWith({ slideRef: 'slide-a', router });
    });

    it('prefers a stem left without conditions over the default stem', async () => {
      seedStems([stemA, stemB, stemC]);

      await runTrigger({
        defaultStemRef: 'stem-c',
        items: [
          { _id: 'i1', elementRef: 'stem-a', conditions: [conditionOn(['yes'])] },
          { _id: 'i2', elementRef: 'stem-c', conditions: [conditionOn(['other'])] }
        ]
      });

      expect(navigateToMock).toHaveBeenCalledWith({ slideRef: 'slide-b', router });
    });

    it('takes the lowest sortOrder when several stems have no conditions', async () => {
      seedStems([stemC, stemB, stemA]);

      await runTrigger({ items: [] });

      expect(navigateToMock).toHaveBeenCalledWith({ slideRef: 'slide-a', router });
    });

    it('falls back to the default stem when every stem has conditions', async () => {
      seedStems([stemA, stemB]);

      await runTrigger({
        defaultStemRef: 'stem-b',
        items: [
          { _id: 'i1', elementRef: 'stem-a', conditions: [conditionOn(['yes'])] },
          { _id: 'i2', elementRef: 'stem-b', conditions: [conditionOn(['other'])] }
        ]
      });

      expect(navigateToMock).toHaveBeenCalledWith({ slideRef: 'slide-b', router });
    });

    it('resolves without navigating when nothing matches and there is no fallback', async () => {
      seedStems([stemA, stemB]);

      await runTrigger({
        items: [
          { _id: 'i1', elementRef: 'stem-a', conditions: [conditionOn(['yes'])] },
          { _id: 'i2', elementRef: 'stem-b', conditions: [conditionOn(['other'])] }
        ]
      });

      expect(navigateToMock).not.toHaveBeenCalled();
      expect(setSlideNavigationMock).not.toHaveBeenCalled();
    });

    it('resolves without navigating when the target stem has no slides', async () => {
      seedStems([stemA, stemB]);
      resetCache('slides');
      seedCache('slides', []);

      await runTrigger({ items: [{ _id: 'i1', elementRef: 'stem-a', conditions: [conditionOn(['yes'])] }] });

      expect(navigateToMock).not.toHaveBeenCalled();
    });

  });

});
