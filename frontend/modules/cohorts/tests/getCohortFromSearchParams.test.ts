import { describe, it, expect } from 'vitest';
import getCohortFromSearchParams from '../helpers/getCohortFromSearchParams';

describe('getCohortFromSearchParams', () => {
  it('returns the cohort query parameter when present', () => {
    const router = { location: { search: '?cohort=cohort-1' } };
    expect(getCohortFromSearchParams(router)).toBe('cohort-1');
  });

  it('returns null when the cohort query parameter is missing', () => {
    const router = { location: { search: '?other=value' } };
    expect(getCohortFromSearchParams(router)).toBeNull();
  });

  it('returns null when the search string is empty', () => {
    const router = { location: { search: '' } };
    expect(getCohortFromSearchParams(router)).toBeNull();
  });

  it('returns the cohort value when multiple parameters are present', () => {
    const router = { location: { search: '?foo=bar&cohort=cohort-2&baz=qux' } };
    expect(getCohortFromSearchParams(router)).toBe('cohort-2');
  });
});
