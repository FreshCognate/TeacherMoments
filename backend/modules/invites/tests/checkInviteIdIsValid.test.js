import { describe, it, expect, vi } from 'vitest';
import { setupMongo } from '../../../../tests/with-mongo.js';
import checkInviteIdIsValid from '../services/checkInviteIdIsValid.js';

const db = setupMongo();

describe('checkInviteIdIsValid', () => {
  it('queries for a cohort that is not deleted, with an active invite matching the token', async () => {
    const findOne = vi.fn().mockResolvedValue({ _id: 'c1' });

    await checkInviteIdIsValid({ inviteId: 'token-abc' }, {}, { models: { Cohort: { findOne } } });

    expect(findOne).toHaveBeenCalledWith({
      isDeleted: { $ne: true },
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

describe('checkInviteIdIsValid (in-memory mongo)', () => {
  const seedCohort = (overrides = {}) => db.models.Cohort.create({
    name: 'Cohort',
    invites: [{ token: 'token-abc', isActive: true }],
    ...overrides
  });

  it('finds a cohort by its active invite', async () => {
    const cohort = await seedCohort();

    const result = await checkInviteIdIsValid({ inviteId: 'token-abc' }, {}, { models: db.models });

    expect(String(result.cohort._id)).toBe(String(cohort._id));
  });

  it('skips a deleted cohort, so its invite link stops working', async () => {
    await seedCohort({ isDeleted: true });

    const result = await checkInviteIdIsValid({ inviteId: 'token-abc' }, {}, { models: db.models });

    expect(result.cohort).toBeNull();
  });

  it('still finds a cohort saved before isDeleted existed', async () => {
    const { insertedId } = await db.models.Cohort.collection.insertOne({
      name: 'Older cohort',
      invites: [{ token: 'token-abc', isActive: true }]
    });

    const result = await checkInviteIdIsValid({ inviteId: 'token-abc' }, {}, { models: db.models });

    expect(String(result.cohort._id)).toBe(String(insertedId));
  });
});
