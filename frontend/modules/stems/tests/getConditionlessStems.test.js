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

const buildStem = (branchingOptions) => ({ ref: 'parent-stem', branchingOptions });

const stemA = { ref: 'stem-a', name: 'A', stemRef: 'parent-stem', sortOrder: 0 };
const stemB = { ref: 'stem-b', name: 'B', stemRef: 'parent-stem', sortOrder: 1 };
const stemC = { ref: 'stem-c', name: 'C', stemRef: 'parent-stem', sortOrder: 2 };

const withCondition = (elementRef) => ({
  elementRef,
  conditions: [{ prompts: [{ ref: 'block-1', text: 'yes' }] }]
});

describe('getConditionlessStems', () => {

  beforeEach(() => {
    resetCache('stems');
  });

  it('treats a child stem with no branching option at all as conditionless', () => {
    seedStems([stemA, stemB]);

    const result = getConditionlessStems({ stem: buildStem([withCondition('stem-a')]) });

    expect(result.map((stem) => stem.ref)).toEqual(['stem-b']);
  });

  it('treats a child stem whose branching option has an empty conditions array as conditionless', () => {
    seedStems([stemA, stemB]);

    const stem = buildStem([withCondition('stem-a'), { elementRef: 'stem-b', conditions: [] }]);

    expect(getConditionlessStems({ stem }).map((childStem) => childStem.ref)).toEqual(['stem-b']);
  });

  it('returns nothing when every child stem has a condition', () => {
    seedStems([stemA, stemB]);

    const stem = buildStem([withCondition('stem-a'), withCondition('stem-b')]);

    expect(getConditionlessStems({ stem })).toEqual([]);
  });

  it('returns every conditionless child stem, ordered by sortOrder', () => {
    seedStems([stemC, stemA, stemB]);

    const result = getConditionlessStems({ stem: buildStem([withCondition('stem-b')]) });

    expect(result.map((stem) => stem.ref)).toEqual(['stem-a', 'stem-c']);
  });

  it('treats every child stem as conditionless when the stem has no branching options', () => {
    seedStems([stemA, stemB]);

    expect(getConditionlessStems({ stem: buildStem([]) }).map((stem) => stem.ref))
      .toEqual(['stem-a', 'stem-b']);
  });

  it('does not fall over when branchingOptions is undefined', () => {
    seedStems([stemA]);

    expect(getConditionlessStems({ stem: { ref: 'parent-stem' } }).map((stem) => stem.ref))
      .toEqual(['stem-a']);
  });

  it('ignores stems that belong to another parent stem', () => {
    seedStems([stemA, { ref: 'stem-x', stemRef: 'other-stem', sortOrder: 0 }]);

    const result = getConditionlessStems({ stem: buildStem([]) });

    expect(result.map((stem) => stem.ref)).toEqual(['stem-a']);
  });

  it('returns nothing when the stem has no child stems', () => {
    seedStems([]);

    expect(getConditionlessStems({ stem: buildStem([]) })).toEqual([]);
  });

  it('returns nothing when no stem is given', () => {
    seedStems([stemA]);

    expect(getConditionlessStems({ stem: null })).toEqual([]);
  });

});
