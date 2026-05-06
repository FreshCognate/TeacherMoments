import { describe, it, expect, vi, beforeEach } from 'vitest';
import testConditions from '../helpers/testConditions.js';
import Conditions from '../forms.conditions.js';

const HIT = 'matched';
const MISS = 'no-match';

describe('testConditions', () => {
  beforeEach(() => {
    Conditions[HIT] = ({ condition }) => ({ hasCondition: true, condition });
    Conditions[MISS] = () => ({ hasCondition: false, condition: null });
  });

  it('returns hasCondition: false when no conditions match', () => {
    const result = testConditions(
      'name',
      { conditions: [{ type: MISS }] },
      { name: 'value' }
    );
    expect(result).toEqual({ hasCondition: false, condition: null, shouldHideField: false });
  });

  it('returns the first matching condition and stops iterating', () => {
    const second = vi.fn(({ condition }) => ({ hasCondition: true, condition }));
    Conditions['second-hit'] = second;

    const result = testConditions(
      'name',
      {
        conditions: [
          { type: HIT, label: 'first' },
          { type: 'second-hit', label: 'second' }
        ]
      },
      { name: 'value' }
    );

    expect(result.hasCondition).toBe(true);
    expect(result.condition).toEqual({ type: HIT, label: 'first' });
    expect(second).not.toHaveBeenCalled();
  });

  it('sets shouldHideField when the matching condition has shouldHideField', () => {
    const result = testConditions(
      'name',
      { conditions: [{ type: HIT, shouldHideField: true }] },
      { name: 'value' }
    );

    expect(result.shouldHideField).toBe(true);
  });

  it('warns and skips when a condition type is not registered', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = testConditions(
      'name',
      { conditions: [{ type: 'bogus' }] },
      { name: 'value' }
    );

    expect(warnSpy).toHaveBeenCalled();
    expect(result.hasCondition).toBe(false);
    warnSpy.mockRestore();
  });

  it('returns early without checking conditions when no model is provided', () => {
    const hit = vi.fn(({ condition }) => ({ hasCondition: true, condition }));
    Conditions['always-hit'] = hit;

    testConditions('name', { conditions: [{ type: 'always-hit' }] }, undefined);

    expect(hit).not.toHaveBeenCalled();
  });
});
