import { describe, it, expect, vi, beforeEach } from 'vitest';

const { addMock, removeMock, getAvailableMock } = vi.hoisted(() => ({
  addMock: vi.fn(),
  removeMock: vi.fn(),
  getAvailableMock: vi.fn()
}));

vi.mock('../services/addCollaboratorsToScenario.js', () => ({ default: (...args) => addMock(...args) }));
vi.mock('../services/removeCollaboratorsFromScenario.js', () => ({ default: (...args) => removeMock(...args) }));
vi.mock('../services/getAvailableCollaboratorsByScenarioId.js', () => ({ default: (...args) => getAvailableMock(...args) }));

import controller from '../scenarioCollaborators.controller.js';

describe('scenarioCollaborators.controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('all', () => {
    it('forwards scenarioId and search/page/deleted to getAvailableCollaboratorsByScenarioId', async () => {
      getAvailableMock.mockResolvedValue({ collaborators: [] });

      await controller.all({
        query: { scenarioId: 's1', searchValue: 'sam', currentPage: 2, isDeleted: false }
      }, { ctx: 1 });

      expect(getAvailableMock).toHaveBeenCalledWith(
        { scenarioId: 's1' },
        { searchValue: 'sam', currentPage: 2, isDeleted: false },
        { ctx: 1 }
      );
    });
  });

  describe('update', () => {
    it('routes ADD to addCollaboratorsToScenario', async () => {
      addMock.mockResolvedValue({});
      await controller.update(
        { param: 's1', body: { setType: 'ADD', collaborators: ['u1'] } },
        { ctx: 1 }
      );
      expect(addMock).toHaveBeenCalledWith({ scenarioId: 's1', collaborators: ['u1'] }, {}, { ctx: 1 });
      expect(removeMock).not.toHaveBeenCalled();
    });

    it('routes REMOVE to removeCollaboratorsFromScenario', async () => {
      removeMock.mockResolvedValue({});
      await controller.update(
        { param: 's1', body: { setType: 'REMOVE', collaborators: ['u1'] } },
        { ctx: 1 }
      );
      expect(removeMock).toHaveBeenCalledWith({ scenarioId: 's1', collaborators: ['u1'] }, {}, { ctx: 1 });
      expect(addMock).not.toHaveBeenCalled();
    });

    it('returns an empty object for unrecognised setType', async () => {
      const result = await controller.update(
        { param: 's1', body: { setType: 'OTHER' } },
        {}
      );
      expect(result).toEqual({});
      expect(addMock).not.toHaveBeenCalled();
      expect(removeMock).not.toHaveBeenCalled();
    });
  });
});
