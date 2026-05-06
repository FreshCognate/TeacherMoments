import { describe, it, expect, beforeEach } from 'vitest';
import canUserEditCohort from '../helpers/canUserEditCohort';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

const seedAuth = (data: any) => {
  resetCache('authentication');
  createCache({
    key: 'authentication',
    cache: { getInitialData: () => data },
    container: { props: {} }
  });
};

describe('canUserEditCohort', () => {
  beforeEach(() => {
    seedAuth({ _id: 'u-1' });
  });

  it('returns false when the user is not authenticated', () => {
    seedAuth({});
    expect(canUserEditCohort({ collaborators: [{ user: 'u-1', role: 'OWNER' }] } as any)).toBe(false);
  });

  it('returns false when there are no collaborators', () => {
    expect(canUserEditCohort({} as any)).toBe(false);
  });

  it('returns true when the user is an OWNER', () => {
    expect(
      canUserEditCohort({ collaborators: [{ user: 'u-1', role: 'OWNER' }] } as any)
    ).toBe(true);
  });

  it('returns true when the user is an AUTHOR', () => {
    expect(
      canUserEditCohort({ collaborators: [{ user: 'u-1', role: 'AUTHOR' }] } as any)
    ).toBe(true);
  });

  it('returns false when the user is a non-editing collaborator', () => {
    expect(
      canUserEditCohort({ collaborators: [{ user: 'u-1', role: 'VIEWER' }] } as any)
    ).toBe(false);
  });

  it('handles collaborator.user being a populated object instead of a string id', () => {
    expect(
      canUserEditCohort({ collaborators: [{ user: { _id: 'u-1' }, role: 'OWNER' }] } as any)
    ).toBe(true);
  });

  it('returns false when the user is not in the collaborator list', () => {
    expect(
      canUserEditCohort({ collaborators: [{ user: 'u-2', role: 'OWNER' }] } as any)
    ).toBe(false);
  });
});
