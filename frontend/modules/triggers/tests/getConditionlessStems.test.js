import { describe, it, expect, beforeEach } from 'vitest';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager.js';

import getConditionlessStems from '../helpers/getConditionlessStems';

const seedStems = (stems) => {
  createCache({
    key: 'stems',
    cache: { getInitialData: () => stems },
    container: { props: {} }
  });
};

const buildTrigger = (items) => ({ elementRef: 'slide-1', items });

const stemA = { ref: 'stem-a', name: 'A', slideRef: 'slide-1', sortOrder: 0 };
const stemB = { ref: 'stem-b', name: 'B', slideRef: 'slide-1', sortOrder: 1 };
const stemC = { ref: 'stem-c', name: 'C', slideRef: 'slide-1', sortOrder: 2 };

const withCondition = (elementRef) => ({
  elementRef,
  conditions: [{ prompts: [{ ref: 'block-1', text: 'yes' }] }]
});

describe('getConditionlessStems', () => {

  beforeEach(() => {
    resetCache('stems');
  });

  it('treats a stem with no item at all as conditionless', () => {
    seedStems([stemA, stemB]);

    const result = getConditionlessStems({ trigger: buildTrigger([withCondition('stem-a')]) });

    expect(result.map((stem) => stem.ref)).toEqual(['stem-b']);
  });

  it('treats a stem whose item has an empty conditions array as conditionless', () => {
    seedStems([stemA, stemB]);

    const trigger = buildTrigger([withCondition('stem-a'), { elementRef: 'stem-b', conditions: [] }]);

    expect(getConditionlessStems({ trigger }).map((stem) => stem.ref)).toEqual(['stem-b']);
  });

  it('returns nothing when every stem has a condition', () => {
    seedStems([stemA, stemB]);

    const trigger = buildTrigger([withCondition('stem-a'), withCondition('stem-b')]);

    expect(getConditionlessStems({ trigger })).toEqual([]);
  });

  it('returns every conditionless stem, ordered by sortOrder', () => {
    seedStems([stemC, stemA, stemB]);

    const result = getConditionlessStems({ trigger: buildTrigger([withCondition('stem-b')]) });

    expect(result.map((stem) => stem.ref)).toEqual(['stem-a', 'stem-c']);
  });

  it('treats every stem as conditionless when the trigger has no items', () => {
    seedStems([stemA, stemB]);

    expect(getConditionlessStems({ trigger: buildTrigger([]) }).map((stem) => stem.ref))
      .toEqual(['stem-a', 'stem-b']);
  });

  it('does not fall over when items is undefined', () => {
    seedStems([stemA]);

    expect(getConditionlessStems({ trigger: { elementRef: 'slide-1' } }).map((stem) => stem.ref))
      .toEqual(['stem-a']);
  });

  it('ignores stems that belong to another slide', () => {
    seedStems([stemA, { ref: 'stem-x', slideRef: 'slide-2', sortOrder: 0 }]);

    const result = getConditionlessStems({ trigger: buildTrigger([]) });

    expect(result.map((stem) => stem.ref)).toEqual(['stem-a']);
  });

  it('returns nothing when the slide has no stems', () => {
    seedStems([]);

    expect(getConditionlessStems({ trigger: buildTrigger([]) })).toEqual([]);
  });

});
