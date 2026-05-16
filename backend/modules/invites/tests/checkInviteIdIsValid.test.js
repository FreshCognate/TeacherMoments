import { describe, it, expect, vi } from 'vitest';
import checkInviteIdIsValid from '../services/checkInviteIdIsValid.js';

describe('checkInviteIdIsValid', () => {
  it('queries for a cohort with an active invite matching the token', async () => {
    const findOne = vi.fn().mockResolvedValue({ _id: 'c1' });

    await checkInviteIdIsValid({ inviteId: 'token-abc' }, {}, { models: { Cohort: { findOne } } });

    expect(findOne).toHaveBeenCalledWith({
      invites: {
        $elemMatch: {
          token: 'token-abc',
          isActive: true
        }
      }
    });
  });

  it('returns the matched cohort', async () => {
    const cohort = { _id: 'c1' };
    const findOne = vi.fn().mockResolvedValue(cohort);

    const result = await checkInviteIdIsValid(
      { inviteId: 'token-abc' },
      {},
      { models: { Cohort: { findOne } } }
    );

    expect(result).toEqual({ cohort });
  });

  it('returns { cohort: null } when no cohort matches', async () => {
    const findOne = vi.fn().mockResolvedValue(null);

    const result = await checkInviteIdIsValid(
      { inviteId: 'unknown' },
      {},
      { models: { Cohort: { findOne } } }
    );

    expect(result).toEqual({ cohort: null });
  });
});
