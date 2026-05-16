import { describe, it, expect, vi, beforeEach } from 'vitest';

const { getUsersByCohortIdMock, removeUserFromCohortMock } = vi.hoisted(() => ({
  getUsersByCohortIdMock: vi.fn(),
  removeUserFromCohortMock: vi.fn()
}));

vi.mock('#core/users/services/getUsersByCohortId.js', () => ({ default: (...args) => getUsersByCohortIdMock(...args) }));
vi.mock('../../cohorts/services/removeUserFromCohort.js', () => ({ default: (...args) => removeUserFromCohortMock(...args) }));

import controller from '../cohortUsers.controller.js';

describe('cohortUsers.controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('all', () => {
    it('forwards cohortId and search/page to getUsersByCohortId', async () => {
      getUsersByCohortIdMock.mockResolvedValue({ users: [] });

      await controller.all({
        query: { cohortId: 'c1', searchValue: 'x', currentPage: 2 }
      }, { ctx: 1 });

      expect(getUsersByCohortIdMock).toHaveBeenCalledWith(
        { cohortId: 'c1' },
        { searchValue: 'x', currentPage: 2 },
        { ctx: 1 }
      );
    });
  });

  describe('delete', () => {
    it('removes the user (URL param) from the cohort (query)', async () => {
      removeUserFromCohortMock.mockResolvedValue({ _id: 'u1' });

      const result = await controller.delete(
        { param: 'u1', query: { cohortId: 'c1' } },
        { ctx: 1 }
      );

      expect(removeUserFromCohortMock).toHaveBeenCalledWith({ userId: 'u1', cohortId: 'c1' }, {}, { ctx: 1 });
      expect(result).toEqual({ _id: 'u1' });
    });
  });
});
