import { describe, it, expect, vi, beforeEach } from 'vitest';
import testValidators from './testValidators.js';
import Validators from '../forms.validators.js';

describe('testValidators', () => {
  beforeEach(() => {
    Validators['hit'] = ({ validator }) => ({ hasError: true, error: validator.message });
    Validators['miss'] = () => ({ hasError: false, error: null });
  });

  it('returns hasError: false when no validator reports an error', () => {
    const result = testValidators(
      'name',
      { validators: [{ type: 'miss' }] },
      { name: 'value' }
    );
    expect(result).toEqual({ hasError: false, error: null });
  });

  it('returns the first error encountered and stops iterating', () => {
    const second = vi.fn(({ validator }) => ({ hasError: true, error: validator.message }));
    Validators['second-hit'] = second;

    const result = testValidators(
      'name',
      {
        validators: [
          { type: 'hit', message: 'First error' },
          { type: 'second-hit', message: 'Second error' }
        ]
      },
      { name: 'value' }
    );

    expect(result.hasError).toBe(true);
    expect(result.error).toBe('First error');
    expect(second).not.toHaveBeenCalled();
  });

  it('warns and skips when a validator type is not registered', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = testValidators(
      'name',
      { validators: [{ type: 'bogus' }] },
      { name: 'value' }
    );

    expect(warnSpy).toHaveBeenCalled();
    expect(result.hasError).toBe(false);
    warnSpy.mockRestore();
  });

  it('passes fieldKey, fieldValue, model, schema and the validator to the registered function', () => {
    const spy = vi.fn(() => ({ hasError: false, error: null }));
    Validators['inspect'] = spy;

    const schema = { validators: [{ type: 'inspect', message: 'm' }] };
    const model = { name: 'value' };

    testValidators('name', schema, model);

    expect(spy).toHaveBeenCalledWith({
      fieldKey: 'name',
      fieldValue: 'value',
      model,
      schema,
      validator: { type: 'inspect', message: 'm' }
    });
  });
});
