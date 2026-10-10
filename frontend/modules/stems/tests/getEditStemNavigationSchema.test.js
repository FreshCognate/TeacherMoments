import { describe, it, expect, beforeEach } from 'vitest';
import getEditStemNavigationSchema from '../schemas/getEditStemNavigationSchema';
import testConditions from '~/core/forms/helpers/testConditions';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';
import '~/modules/triggers/helpers/hasConditionlessStem.condition';

const childStemA = { ref: 'stem-a', name: 'A', stemRef: 'parent', sortOrder: 0 };
const childStemB = { ref: 'stem-b', name: 'B', stemRef: 'parent', sortOrder: 1 };
const otherStem = { ref: 'stem-c', name: 'C', stemRef: 'another-parent', sortOrder: 0 };

const condition = { prompts: [{ ref: 'block-1', options: ['option-1'] }] };

const buildStem = (branchingOptions) => ({ ref: 'parent', branchingOptions });

const isDefaultHidden = (stem) => {
  const schema = getEditStemNavigationSchema({ stem });
  return testConditions('defaultBranchingStemRef', schema.defaultBranchingStemRef, stem).shouldHideField;
};

describe('getEditStemNavigationSchema', () => {
  beforeEach(() => {
    resetCache('stems');
    createCache({
      key: 'stems',
      cache: { getInitialData: () => [childStemA, childStemB, otherStem] },
      container: { props: {} }
    });
  });

  it('edits the branching options with the TriggerStems field', () => {
    const schema = getEditStemNavigationSchema({ stem: buildStem([]) });
    expect(schema.branchingOptions.type).toBe('TriggerStems');
  });

  it('offers None plus only the child stems as the default stem', () => {
    const schema = getEditStemNavigationSchema({ stem: buildStem([]) });
    expect(schema.defaultBranchingStemRef.options).toEqual([
      { value: '', text: 'None' },
      { value: 'stem-a', text: 'A' },
      { value: 'stem-b', text: 'B' }
    ]);
  });

  it('hides the default stem while a child stem has no branching option', () => {
    const stem = buildStem([{ elementRef: 'stem-a', conditions: [condition] }]);
    expect(isDefaultHidden(stem)).toBe(true);
  });

  it('hides the default stem when a branching option has had its conditions removed', () => {
    const stem = buildStem([
      { elementRef: 'stem-a', conditions: [condition] },
      { elementRef: 'stem-b', conditions: [] }
    ]);
    expect(isDefaultHidden(stem)).toBe(true);
  });

  it('shows the default stem once every child stem has conditions', () => {
    const stem = buildStem([
      { elementRef: 'stem-a', conditions: [condition] },
      { elementRef: 'stem-b', conditions: [condition] }
    ]);
    expect(isDefaultHidden(stem)).toBe(false);
  });
});
