import { describe, it, expect, vi, beforeEach } from 'vitest';

const {
  getScenariosMock,
  getScenarioByIdMock,
  restoreScenarioByIdMock,
  updateScenarioByIdMock,
  deleteScenarioByIdMock,
  createScenarioMock,
  duplicateScenarioMock
} = vi.hoisted(() => ({
  getScenariosMock: vi.fn(),
  getScenarioByIdMock: vi.fn(),
  restoreScenarioByIdMock: vi.fn(),
  updateScenarioByIdMock: vi.fn(),
  deleteScenarioByIdMock: vi.fn(),
  createScenarioMock: vi.fn(),
  duplicateScenarioMock: vi.fn()
}));

vi.mock('../services/getScenarios.js', () => ({ default: (...args) => getScenariosMock(...args) }));
vi.mock('../services/getScenarioById.js', () => ({ default: (...args) => getScenarioByIdMock(...args) }));
vi.mock('../services/restoreScenarioById.js', () => ({ default: (...args) => restoreScenarioByIdMock(...args) }));
vi.mock('../services/updateScenarioById.js', () => ({ default: (...args) => updateScenarioByIdMock(...args) }));
vi.mock('../services/deleteScenarioById.js', () => ({ default: (...args) => deleteScenarioByIdMock(...args) }));
vi.mock('../services/createScenario.js', () => ({ default: (...args) => createScenarioMock(...args) }));
vi.mock('../services/duplicateScenario.js', () => ({ default: (...args) => duplicateScenarioMock(...args) }));

import controller from '../scenarios.controller.js';

describe('scenarios.controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('all', () => {
    it('forwards search/page/sort/access/deleted to getScenarios', async () => {
      getScenariosMock.mockResolvedValue({ scenarios: [] });

      await controller.all({
        query: { searchValue: 'x', currentPage: 2, sortBy: 'NEWEST', accessType: 'PUBLIC', isDeleted: false }
      }, { ctx: 1 });

      expect(getScenariosMock).toHaveBeenCalledWith(
        { accessType: 'PUBLIC' },
        { searchValue: 'x', currentPage: 2, sortBy: 'NEWEST', isDeleted: false },
        { ctx: 1 }
      );
    });
  });

  describe('create', () => {
    it('routes to duplicateScenario when scenarioId is in the body', async () => {
      duplicateScenarioMock.mockResolvedValue({ _id: 's-new' });
      const result = await controller.create({ body: { scenarioId: 'src' } }, {});
      expect(duplicateScenarioMock).toHaveBeenCalledWith({ scenarioId: 'src' }, {}, {});
      expect(result).toEqual({ scenario: { _id: 's-new' } });
    });

    it('routes to createScenario otherwise', async () => {
      createScenarioMock.mockResolvedValue({ _id: 's1' });
      const result = await controller.create({ body: { name: 'New', accessType: 'PUBLIC' } }, {});
      expect(createScenarioMock).toHaveBeenCalledWith({ name: 'New', accessType: 'PUBLIC' }, {}, {});
      expect(result).toEqual({ scenario: { _id: 's1' } });
    });
  });

  describe('read', () => {
    it('looks up by URL param', async () => {
      getScenarioByIdMock.mockResolvedValue({ _id: 's1' });
      const result = await controller.read({ param: 's1' }, {});
      expect(getScenarioByIdMock).toHaveBeenCalledWith({ scenarioId: 's1' }, {}, {});
      expect(result).toEqual({ scenario: { _id: 's1' } });
    });
  });

  describe('update', () => {
    it('routes to restoreScenarioById when isDeleted is in the body', async () => {
      restoreScenarioByIdMock.mockResolvedValue({ _id: 's1' });
      const result = await controller.update({ param: 's1', body: { isDeleted: false } }, {});
      expect(restoreScenarioByIdMock).toHaveBeenCalled();
      expect(updateScenarioByIdMock).not.toHaveBeenCalled();
      expect(result).toEqual({ scenario: { _id: 's1' } });
    });

    it('routes to updateScenarioById otherwise', async () => {
      updateScenarioByIdMock.mockResolvedValue({ _id: 's1', name: 'New' });
      const result = await controller.update({ param: 's1', body: { name: 'New' } }, {});
      expect(updateScenarioByIdMock).toHaveBeenCalledWith({ scenarioId: 's1', update: { name: 'New' } }, {}, {});
      expect(result).toEqual({ scenario: { _id: 's1', name: 'New' } });
    });
  });

  describe('delete', () => {
    it('soft-deletes and wraps under "scenario"', async () => {
      deleteScenarioByIdMock.mockResolvedValue({ _id: 's1' });
      const result = await controller.delete({ param: 's1' }, {});
      expect(deleteScenarioByIdMock).toHaveBeenCalledWith({ scenarioId: 's1' }, {}, {});
      expect(result).toEqual({ scenario: { _id: 's1' } });
    });
  });
});
