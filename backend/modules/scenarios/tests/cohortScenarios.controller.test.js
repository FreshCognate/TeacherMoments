import { describe, it, expect, vi, beforeEach } from 'vitest';

const { getPublishedScenariosByCohortIdMock, sortCohortScenariosMock } = vi.hoisted(() => ({
  getPublishedScenariosByCohortIdMock: vi.fn(),
  sortCohortScenariosMock: vi.fn()
}));

vi.mock('../services/getPublishedScenariosByCohortId.js', () => ({ default: (...args) => getPublishedScenariosByCohortIdMock(...args) }));
vi.mock('../services/sortCohortScenarios.js', () => ({ default: (...args) => sortCohortScenariosMock(...args) }));

import controller from '../cohortScenarios.controller.js';

describe('cohortScenarios.controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('all', () => {
    it('returns published scenarios for the cohort', async () => {
      getPublishedScenariosByCohortIdMock.mockResolvedValue({ scenarios: [] });

      await controller.all({ query: { cohortId: 'c1' } }, { ctx: 1 });

      expect(getPublishedScenariosByCohortIdMock).toHaveBeenCalledWith({ cohortId: 'c1' }, {}, { ctx: 1 });
    });
  });

  describe('create', () => {
    it('sorts the scenarios for the cohort', async () => {
      sortCohortScenariosMock.mockResolvedValue({});

      const result = await controller.create({
        body: { cohortId: 'c1', scenarios: [{ _id: 's1', sortOrder: 0 }] }
      }, { ctx: 1 });

      expect(sortCohortScenariosMock).toHaveBeenCalledWith(
        { cohortId: 'c1', scenarios: [{ _id: 's1', sortOrder: 0 }] },
        {},
        { ctx: 1 }
      );
      expect(result).toEqual({});
    });
  });
});
