import { describe, it, expect, beforeEach } from 'vitest';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager.js';
import getStemErrors from '../helpers/getStemErrors';

const seedCache = (key, data) => {
  createCache({
    key,
    cache: { getInitialData: () => data },
    container: { props: {} }
  });
};

const buildStem = (branchingOptions) => ({ _id: 'st1', ref: 'stem-1', branchingOptions });

const stemOne = { ref: 'child-1', name: 'Stem 1', sortOrder: 0 };
const stemTwo = { ref: 'child-2', name: 'Stem 2', sortOrder: 1 };
const stemThree = { ref: 'child-3', name: 'Stem 3', sortOrder: 2 };

const multipleChoiceBlock = {
  ref: 'block-mc',
  blockType: 'MULTIPLE_CHOICE_PROMPT',
  options: [{ _id: 'option-a' }, { _id: 'option-b' }]
};

const inputBlock = { ref: 'block-input', blockType: 'INPUT_PROMPT' };

const withPrompts = (stemRef, prompts) => ({
  stemRef,
  conditions: [{ _id: 'c1', prompts }]
});

const buildError = (message) => ({ message, elementType: 'STEM', elementId: 'st1' });

const buildUnreachableError = (name) => buildError(`Stem "${name}" cannot be navigated to`);

const buildInvalidAnswerError = (name) => buildError(`Stem "${name}" has a condition without a valid answer selected`);

describe('getStemErrors', () => {
  beforeEach(() => {
    resetCache('stems');
    resetCache('blocks');
    seedCache('blocks', [multipleChoiceBlock, inputBlock]);
  });

  it('returns no errors when the stem has no child stems', () => {
    seedCache('stems', []);

    expect(getStemErrors(buildStem([]))).toEqual([]);
  });

  it('returns no errors when a single child stem has no conditions', () => {
    seedCache('stems', [stemOne, stemTwo]);

    const stem = buildStem([withPrompts('child-1', [{ ref: 'block-input', text: 'yes' }])]);

    expect(getStemErrors(stem)).toEqual([]);
  });

  it('flags every child stem with no conditions after the first', () => {
    seedCache('stems', [stemOne, stemTwo, stemThree]);

    const stem = buildStem([
      { stemRef: 'child-1', conditions: [] },
      { stemRef: 'child-2', conditions: [] },
      { stemRef: 'child-3', conditions: [] }
    ]);

    expect(getStemErrors(stem)).toEqual([
      buildUnreachableError('Stem 2'),
      buildUnreachableError('Stem 3')
    ]);
  });

  it('returns no errors when every prompt has a valid answer', () => {
    seedCache('stems', [stemOne]);

    const stem = buildStem([withPrompts('child-1', [
      { ref: 'block-mc', options: ['option-a'] },
      { ref: 'block-input', text: 'yes' }
    ])]);

    expect(getStemErrors(stem)).toEqual([]);
  });

  it('returns no errors when only one prompt in a condition has a valid answer', () => {
    seedCache('stems', [stemOne]);

    const stem = buildStem([withPrompts('child-1', [
      { ref: 'block-mc', options: [] },
      { ref: 'block-input', text: 'yes' }
    ])]);

    expect(getStemErrors(stem)).toEqual([]);
  });

  it('flags a condition where no prompt has a valid answer', () => {
    seedCache('stems', [stemOne]);

    const stem = buildStem([withPrompts('child-1', [
      { ref: 'block-mc', options: [] },
      { ref: 'block-input', text: '' }
    ])]);

    expect(getStemErrors(stem)).toEqual([buildInvalidAnswerError('Stem 1')]);
  });

  it('flags a multiple choice prompt with no options selected', () => {
    seedCache('stems', [stemOne]);

    const stem = buildStem([withPrompts('child-1', [{ ref: 'block-mc', options: [] }])]);

    expect(getStemErrors(stem)).toEqual([buildInvalidAnswerError('Stem 1')]);
  });

  it('flags a multiple choice prompt with an option that no longer exists', () => {
    seedCache('stems', [stemOne]);

    const stem = buildStem([withPrompts('child-1', [{ ref: 'block-mc', options: ['option-a', 'option-z'] }])]);

    expect(getStemErrors(stem)).toEqual([buildInvalidAnswerError('Stem 1')]);
  });

  it('flags an input prompt with no text', () => {
    seedCache('stems', [stemOne]);

    const stem = buildStem([withPrompts('child-1', [{ ref: 'block-input', text: '  ' }])]);

    expect(getStemErrors(stem)).toEqual([buildInvalidAnswerError('Stem 1')]);
  });

  it('flags a prompt whose block no longer exists', () => {
    seedCache('stems', [stemOne]);

    const stem = buildStem([withPrompts('child-1', [{ ref: 'block-missing', text: 'yes' }])]);

    expect(getStemErrors(stem)).toEqual([buildInvalidAnswerError('Stem 1')]);
  });
});
