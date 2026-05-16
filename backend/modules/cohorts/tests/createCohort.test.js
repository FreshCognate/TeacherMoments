import { describe, it, expect, vi, beforeEach } from 'vitest';

const { generateInviteTokenMock } = vi.hoisted(() => ({
  generateInviteTokenMock: vi.fn()
}));

vi.mock('../helpers/generateInviteToken.js', () => ({
  default: () => generateInviteTokenMock()
}));

vi.mock('../../slides/services/createSlide.js', () => ({ default: vi.fn() }));

import createCohort from '../services/createCohort.js';

describe('createCohort', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    generateInviteTokenMock.mockReturnValue('invite-token-123');
  });

  it('throws 400 when no name is given', async () => {
    await expect(createCohort({}, {}, { user: { _id: 'u1' }, models: {} }))
      .rejects.toMatchObject({ statusCode: 400, message: 'A cohort must have a name' });
  });

  it('creates a cohort with the user as OWNER and an active invite', async () => {
    const create = vi.fn().mockResolvedValue({ _id: 'cohort-1' });
    await createCohort(
      { name: 'Spring Cohort' },
      {},
      { user: { _id: 'u1' }, models: { Cohort: { create } } }
    );

    expect(create).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Spring Cohort',
      createdBy: 'u1',
      collaborators: [{ user: 'u1', role: 'OWNER' }]
    }));

    const invites = create.mock.calls[0][0].invites;
    expect(invites).toHaveLength(1);
    expect(invites[0]).toMatchObject({ token: 'invite-token-123', isActive: true, createdBy: 'u1' });
  });

  it('returns the created cohort', async () => {
    const cohort = { _id: 'cohort-1' };
    const create = vi.fn().mockResolvedValue(cohort);

    const result = await createCohort(
      { name: 'Cohort' },
      {},
      { user: { _id: 'u1' }, models: { Cohort: { create } } }
    );

    expect(result).toBe(cohort);
  });
});
