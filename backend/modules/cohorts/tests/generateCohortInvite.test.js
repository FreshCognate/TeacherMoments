import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { checkAccessMock, generateInviteTokenMock } = vi.hoisted(() => ({
  checkAccessMock: vi.fn(),
  generateInviteTokenMock: vi.fn()
}));

vi.mock('../helpers/checkHasAccessToEditCohort.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));

vi.mock('../helpers/generateInviteToken.js', () => ({
  default: () => generateInviteTokenMock()
}));

import generateCohortInvite from '../services/generateCohortInvite.js';

const FIXED_NOW = new Date('2026-05-06T12:00:00Z');

const buildModel = (cohort) => {
  let callIndex = 0;
  return {
    findByIdAndUpdate: vi.fn((..._args) => {
      callIndex += 1;
      if (callIndex === 1) {
        // First call: deactivate existing invites — returns a Promise for catch chain
        return Promise.resolve();
      }
      // Second call: push new invite + populate
      return { populate: vi.fn().mockResolvedValue(cohort) };
    })
  };
};

describe('generateCohortInvite', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
    vi.clearAllMocks();
    generateInviteTokenMock.mockReturnValue('new-token-abc');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('deactivates existing active invites', async () => {
    const Cohort = buildModel({ _id: 'c1' });
    await generateCohortInvite({ cohortId: 'c1' }, {}, { models: { Cohort }, user: { _id: 'u1' } });

    expect(Cohort.findByIdAndUpdate).toHaveBeenNthCalledWith(1, 'c1', {
      $set: { 'invites.$[invite].isActive': false }
    }, {
      arrayFilters: [{ 'invite.isActive': true }]
    });
  });

  it('pushes a new active invite onto the cohort', async () => {
    const Cohort = buildModel({ _id: 'c1' });
    await generateCohortInvite({ cohortId: 'c1' }, {}, { models: { Cohort }, user: { _id: 'u1' } });

    const [, update] = Cohort.findByIdAndUpdate.mock.calls[1];
    expect(update.$push.invites).toMatchObject({
      token: 'new-token-abc',
      isActive: true,
      createdBy: 'u1',
      createdAt: FIXED_NOW
    });
  });

  it('throws 404 when the cohort does not exist', async () => {
    const Cohort = buildModel(null);
    await expect(generateCohortInvite(
      { cohortId: 'missing' },
      {},
      { models: { Cohort }, user: { _id: 'u1' } }
    )).rejects.toMatchObject({ statusCode: 404 });
  });
});
