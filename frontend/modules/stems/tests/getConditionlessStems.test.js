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

const stemA = { ref: 'stem-a', name: 'A' };
const stemB = { ref: 'stem-b', name: 'B' };
const stemC = { ref: 'stem-c', name: 'C' };

const withCondition = (stemRef) => ({
  stemRef,
  conditions: [{ prompts: [{ ref: 'block-1', text: 'yes' }] }]
});

const withoutCondition = (stemRef) => ({ stemRef, conditions: [] });

describe('getConditionlessStems', () => {

  beforeEach(() => {
    resetCache('stems');
  });

  it('treats a child stem whose branching option has an empty conditions array as conditionless', () => {
    seedStems([stemA, stemB]);

    const stem = buildStem([withCondition('stem-a'), withoutCondition('stem-b')]);

    expect(getConditionlessStems({ stem }).map((childStem) => childStem.ref)).toEqual(['stem-b']);
  });

  it('returns nothing when every child stem has a condition', () => {
    seedStems([stemA, stemB]);

    const stem = buildStem([withCondition('stem-a'), withCondition('stem-b')]);

    expect(getConditionlessStems({ stem })).toEqual([]);
  });

  it('returns every conditionless child stem in branching option order', () => {
    seedStems([stemA, stemB, stemC]);

    const stem = buildStem([withoutCondition('stem-c'), withCondition('stem-b'), withoutCondition('stem-a')]);

    expect(getConditionlessStems({ stem }).map((childStem) => childStem.ref)).toEqual(['stem-c', 'stem-a']);
  });

  it('ignores stems that are not in the branching options', () => {
    seedStems([stemA, stemB]);

    const stem = buildStem([withoutCondition('stem-a')]);

    expect(getConditionlessStems({ stem }).map((childStem) => childStem.ref)).toEqual(['stem-a']);
  });

  it('does not fall over when branchingOptions is undefined', () => {
    seedStems([stemA]);

    expect(getConditionlessStems({ stem: { ref: 'parent-stem' } })).toEqual([]);
  });

  it('returns nothing when the stem has no child stems', () => {
    seedStems([stemA]);

    expect(getConditionlessStems({ stem: buildStem([]) })).toEqual([]);
  });

  it('returns nothing when no stem is given', () => {
    seedStems([stemA]);

    expect(getConditionlessStems({ stem: null })).toEqual([]);
  });

});
