import { describe, it, expect } from 'vitest';
import getStemErrors from '../helpers/getStemErrors';

describe('getStemErrors', () => {
  it('returns no errors', () => {
    expect(getStemErrors({ _id: 'st1', ref: 'stem-1', slideRef: 'slide-1', branchingOptions: [] })).toEqual([]);
  });
});
