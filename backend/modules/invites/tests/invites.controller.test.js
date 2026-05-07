import { describe, it, expect, vi, beforeEach } from 'vitest';

const { addUserToCohortMock, checkInviteIdIsValidMock } = vi.hoisted(() => ({
  addUserToCohortMock: vi.fn(),
  checkInviteIdIsValidMock: vi.fn()
}));

vi.mock('../../cohorts/services/addUserToCohort.js', () => ({
  default: (...args) => addUserToCohortMock(...args)
}));

vi.mock('../services/checkInviteIdIsValid.js', () => ({
  default: (...args) => checkInviteIdIsValidMock(...args)
}));

import controller from '../invites.controller.js';

describe('invites.controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns an empty object when no inviteId is provided', async () => {
    const result = await controller.create({ body: {} }, { user: { _id: 'u1' } });
    expect(result).toEqual({});
    expect(checkInviteIdIsValidMock).not.toHaveBeenCalled();
    expect(addUserToCohortMock).not.toHaveBeenCalled();
  });

  it('returns an empty object when the invite token is invalid', async () => {
    checkInviteIdIsValidMock.mockResolvedValue({ cohort: null });

    const result = await controller.create(
      { body: { inviteId: 'bad-token' } },
      { user: { _id: 'u1' } }
    );

    expect(result).toEqual({});
    expect(addUserToCohortMock).not.toHaveBeenCalled();
  });

  it('adds the authenticated user to the cohort and returns both cohort and user', async () => {
    const cohort = { _id: 'c1' };
    checkInviteIdIsValidMock.mockResolvedValue({ cohort });
    addUserToCohortMock.mockResolvedValue({ _id: 'u1', cohorts: [{ cohort: 'c1' }] });

    const result = await controller.create(
      { body: { inviteId: 'good-token' } },
      { user: { _id: 'u1' } }
    );

    expect(addUserToCohortMock).toHaveBeenCalledWith(
      { cohortId: 'c1' },
      {},
      { user: { _id: 'u1' } }
    );
    expect(result).toEqual({
      cohort,
      user: { _id: 'u1', cohorts: [{ cohort: 'c1' }] }
    });
  });

  it('returns just the cohort when the user is not authenticated', async () => {
    const cohort = { _id: 'c1' };
    checkInviteIdIsValidMock.mockResolvedValue({ cohort });

    const result = await controller.create(
      { body: { inviteId: 'good-token' } },
      { user: null }
    );

    expect(addUserToCohortMock).not.toHaveBeenCalled();
    expect(result).toEqual({ cohort });
  });

  it('treats a user without an _id as unauthenticated', async () => {
    const cohort = { _id: 'c1' };
    checkInviteIdIsValidMock.mockResolvedValue({ cohort });

    const result = await controller.create(
      { body: { inviteId: 'good-token' } },
      { user: {} }
    );

    expect(addUserToCohortMock).not.toHaveBeenCalled();
    expect(result).toEqual({ cohort });
  });
});
