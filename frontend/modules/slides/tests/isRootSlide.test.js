import { describe, it, expect, vi, beforeEach } from 'vitest';

const getCacheMock = vi.fn();
vi.mock('~/core/cache/helpers/getCache', () => ({
  default: (key) => getCacheMock(key)
}));

import Conditions from '~/core/forms/forms.conditions';
import '../helpers/isRootSlide.condition';

describe('isRootSlide condition', () => {
  beforeEach(() => {
    getCacheMock.mockReset();
  });

  it('registers itself as the "isRootSlide" condition', () => {
    expect(Conditions.isRootSlide).toBeTypeOf('function');
  });

  it('returns hasCondition: true when the active slide is a root slide', () => {
    getCacheMock.mockReturnValue({ data: { isRoot: true } });
    const result = Conditions.isRootSlide({ condition: {} });
    expect(result).toEqual({ hasCondition: true });
  });

  it('returns hasCondition: false and a null condition when the active slide is not a root slide', () => {
    getCacheMock.mockReturnValue({ data: { isRoot: false } });
    const result = Conditions.isRootSlide({ condition: {} });
    expect(result).toEqual({ hasCondition: false, condition: null });
  });
});
