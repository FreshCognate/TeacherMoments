import { describe, it, expect } from 'vitest';
import '../conditions/modelValueIs.js';
import Conditions from '~/core/forms/forms.conditions';

describe('modelValueIs', () => {
  const modelValueIs = Conditions.modelValueIs;

  it('returns hasCondition: false when the model value is in condition.values', () => {
    const result = modelValueIs({
      model: { kind: 'foo' },
      condition: { field: 'kind', values: ['foo', 'bar'] }
    });

    expect(result).toEqual({ hasCondition: false, condition: null });
  });

  it('returns hasCondition: true when the model value is not in condition.values', () => {
    const condition = { field: 'kind', values: ['foo', 'bar'] };
    const result = modelValueIs({ model: { kind: 'baz' }, condition });

    expect(result).toEqual({ hasCondition: true, condition });
  });

  it('reads nested fields from the model via lodash.get', () => {
    const result = modelValueIs({
      model: { meta: { kind: 'foo' } },
      condition: { field: 'meta.kind', values: ['foo'] }
    });

    expect(result.hasCondition).toBe(false);
  });
});
