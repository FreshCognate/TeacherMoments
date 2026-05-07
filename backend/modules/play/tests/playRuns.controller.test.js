import { describe, it, expect, vi, beforeEach } from 'vitest';

const {
  getUsersRunByScenarioIdMock,
  getUsersRunsByCohortIdMock,
  updateUsersRunByScenarioIdMock
} = vi.hoisted(() => ({
  getUsersRunByScenarioIdMock: vi.fn(),
  getUsersRunsByCohortIdMock: vi.fn(),
  updateUsersRunByScenarioIdMock: vi.fn()
}));

vi.mock('../../runs/services/getUsersRunByScenarioId.js', () => ({ default: (...args) => getUsersRunByScenarioIdMock(...args) }));
vi.mock('../../runs/services/getUsersRunsByCohortId.js', () => ({ default: (...args) => getUsersRunsByCohortIdMock(...args) }));
vi.mock('../../runs/services/updateUsersRunByScenarioId.js', () => ({ default: (...args) => updateUsersRunByScenarioIdMock(...args) }));

import controller from '../playRuns.controller.js';

describe('playRuns.controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('all', () => {
    it('maps query.cohort to cohortId and forwards', async () => {
      getUsersRunsByCohortIdMock.mockResolvedValue({ runs: [] });

      const result = await controller.all({ query: { cohort: 'c1' } }, { ctx: 1 });

      expect(getUsersRunsByCohortIdMock).toHaveBeenCalledWith({ cohortId: 'c1' }, {}, { ctx: 1 });
      expect(result).toEqual({ runs: [] });
    });
  });

  describe('read', () => {
    it('maps URL param to scenarioId and query.cohort to cohortId', async () => {
      getUsersRunByScenarioIdMock.mockResolvedValue({ _id: 'r1' });

      const result = await controller.read({ param: 's1', query: { cohort: 'c1' } }, { ctx: 1 });

      expect(getUsersRunByScenarioIdMock).toHaveBeenCalledWith(
        { scenarioId: 's1', cohortId: 'c1' },
        {},
        { ctx: 1 }
      );
      expect(result).toEqual({ run: { _id: 'r1' } });
    });
  });

  describe('update', () => {
    it('maps URL param to scenarioId and forwards body as update', async () => {
      updateUsersRunByScenarioIdMock.mockResolvedValue({ _id: 'r1', isComplete: true });

      const result = await controller.update(
        { param: 's1', body: { isComplete: true } },
        { ctx: 1 }
      );

      expect(updateUsersRunByScenarioIdMock).toHaveBeenCalledWith(
        { scenarioId: 's1', update: { isComplete: true } },
        {},
        { ctx: 1 }
      );
      expect(result).toEqual({ run: { _id: 'r1', isComplete: true } });
    });
  });
});
