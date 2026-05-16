import { describe, it, expect, vi, beforeEach } from 'vitest';

const {
  getUsersMock,
  getUserByIdMock,
  updateUserByIdMock,
  deleteUserByIdMock,
  createAuthoringUsersMock,
  restoreUserByIdMock
} = vi.hoisted(() => ({
  getUsersMock: vi.fn(),
  getUserByIdMock: vi.fn(),
  updateUserByIdMock: vi.fn(),
  deleteUserByIdMock: vi.fn(),
  createAuthoringUsersMock: vi.fn(),
  restoreUserByIdMock: vi.fn()
}));

vi.mock('../services/getUsers.js', () => ({ default: (...args) => getUsersMock(...args) }));
vi.mock('../services/getUserById.js', () => ({ default: (...args) => getUserByIdMock(...args) }));
vi.mock('../services/updateUserById.js', () => ({ default: (...args) => updateUserByIdMock(...args) }));
vi.mock('../services/deleteUserById.js', () => ({ default: (...args) => deleteUserByIdMock(...args) }));
vi.mock('../services/createAuthoringUsers.js', () => ({ default: (...args) => createAuthoringUsersMock(...args) }));
vi.mock('../services/restoreUserById.js', () => ({ default: (...args) => restoreUserByIdMock(...args) }));

import controller from '../users.controller.js';

describe('users.controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('all', () => {
    it('forwards searchValue, currentPage, isDeleted as options', async () => {
      getUsersMock.mockResolvedValue({ users: [], count: 0 });
      const context = { ctx: 'value' };

      await controller.all({ query: { searchValue: 'sam', currentPage: 2, isDeleted: true } }, context);

      expect(getUsersMock).toHaveBeenCalledWith({}, { searchValue: 'sam', currentPage: 2, isDeleted: true }, context);
    });

    it('returns the getUsers result', async () => {
      const users = { users: [{ _id: 'u1' }], count: 1 };
      getUsersMock.mockResolvedValue(users);

      const result = await controller.all({ query: {} }, {});
      expect(result).toBe(users);
    });
  });

  describe('create', () => {
    it('passes emails and role through to createAuthoringUsers (defaulting role to "user")', async () => {
      createAuthoringUsersMock.mockResolvedValue({});
      const context = { ctx: 'value' };

      await controller.create({ body: { emails: ['a@b.com'] } }, context);

      expect(createAuthoringUsersMock).toHaveBeenCalledWith({ emails: ['a@b.com'], role: 'user' }, {}, context);
    });

    it('respects an explicit role on the body', async () => {
      createAuthoringUsersMock.mockResolvedValue({});

      await controller.create({ body: { emails: ['a@b.com'], role: 'ADMIN' } }, {});

      expect(createAuthoringUsersMock).toHaveBeenCalledWith({ emails: ['a@b.com'], role: 'ADMIN' }, {}, {});
    });
  });

  describe('read', () => {
    it('looks up the user by the URL param and wraps under "user"', async () => {
      getUserByIdMock.mockResolvedValue({ _id: 'u1' });

      const result = await controller.read({ param: 'u1' }, {});
      expect(getUserByIdMock).toHaveBeenCalledWith({ userId: 'u1' }, {}, {});
      expect(result).toEqual({ user: { _id: 'u1' } });
    });
  });

  describe('update', () => {
    it('routes to restoreUserById when isDeleted is in the body', async () => {
      restoreUserByIdMock.mockResolvedValue({ _id: 'u1', isDeleted: false });

      const result = await controller.update({ param: 'u1', body: { isDeleted: false } }, { ctx: 'value' });

      expect(restoreUserByIdMock).toHaveBeenCalledWith({ userId: 'u1' }, {}, { ctx: 'value' });
      expect(updateUserByIdMock).not.toHaveBeenCalled();
      expect(result).toEqual({ user: { _id: 'u1', isDeleted: false } });
    });

    it('routes to updateUserById otherwise', async () => {
      updateUserByIdMock.mockResolvedValue({ _id: 'u1', firstName: 'Sam' });

      const result = await controller.update({ param: 'u1', body: { firstName: 'Sam' } }, { ctx: 'value' });

      expect(updateUserByIdMock).toHaveBeenCalledWith({ userId: 'u1', update: { firstName: 'Sam' } }, {}, { ctx: 'value' });
      expect(restoreUserByIdMock).not.toHaveBeenCalled();
      expect(result).toEqual({ user: { _id: 'u1', firstName: 'Sam' } });
    });
  });

  describe('delete', () => {
    it('soft-deletes via deleteUserById and wraps under "user"', async () => {
      deleteUserByIdMock.mockResolvedValue({ _id: 'u1', isDeleted: true });

      const result = await controller.delete({ param: 'u1' }, { ctx: 'value' });

      expect(deleteUserByIdMock).toHaveBeenCalledWith({ userId: 'u1' }, {}, { ctx: 'value' });
      expect(result).toEqual({ user: { _id: 'u1', isDeleted: true } });
    });
  });
});
