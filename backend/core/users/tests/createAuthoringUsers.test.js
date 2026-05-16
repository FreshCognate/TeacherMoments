import { describe, it, expect, vi, beforeEach } from 'vitest';

const { registerAuthoringUserMock } = vi.hoisted(() => ({
  registerAuthoringUserMock: vi.fn()
}));

vi.mock('../services/registerAuthoringUser.js', () => ({
  default: (...args) => registerAuthoringUserMock(...args)
}));

import createAuthoringUsers from '../services/createAuthoringUsers.js';

describe('createAuthoringUsers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    registerAuthoringUserMock.mockResolvedValue({});
  });

  it('registers each email with the given role', async () => {
    const context = { user: { _id: 'admin' } };
    await createAuthoringUsers(
      { emails: ['a@example.com', 'b@example.com'], role: 'ADMIN' },
      {},
      context
    );

    expect(registerAuthoringUserMock).toHaveBeenCalledTimes(2);
    expect(registerAuthoringUserMock).toHaveBeenCalledWith({ email: 'a@example.com', role: 'ADMIN' }, context);
    expect(registerAuthoringUserMock).toHaveBeenCalledWith({ email: 'b@example.com', role: 'ADMIN' }, context);
  });

  it('does nothing when emails is empty or missing', async () => {
    await createAuthoringUsers({ emails: [], role: 'ADMIN' }, {}, {});
    await createAuthoringUsers({ role: 'ADMIN' }, {}, {});
    expect(registerAuthoringUserMock).not.toHaveBeenCalled();
  });

  it('returns an empty object', async () => {
    const result = await createAuthoringUsers({ emails: ['a@b.com'], role: 'ADMIN' }, {}, {});
    expect(result).toEqual({});
  });
});
