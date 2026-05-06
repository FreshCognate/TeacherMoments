import { describe, it, expect } from 'vitest';
import getCohortInviteLink from '../helpers/getCohortInviteLink';

describe('getCohortInviteLink', () => {
  it('returns a link built from window.location.host and the invite token', () => {
    const link = getCohortInviteLink({
      cohortId: 'cohort-1',
      invite: { token: 'abc123' } as any
    });
    expect(link).toBe(`${window.location.host}/invite/abc123`);
  });

  it('returns the host with an empty token when the invite has no token', () => {
    const link = getCohortInviteLink({
      cohortId: 'cohort-1',
      invite: { token: '' } as any
    });
    expect(link).toBe(`${window.location.host}/invite/`);
  });
});
