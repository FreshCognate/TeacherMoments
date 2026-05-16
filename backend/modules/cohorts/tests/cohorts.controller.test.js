import { describe, it, expect, vi, beforeEach } from 'vitest';

const {
  getCohortsMock,
  getCohortByIdMock,
  restoreCohortByIdMock,
  updateCohortByIdMock,
  deleteCohortByIdMock,
  createCohortMock,
  duplicateCohortMock,
  archiveCohortByIdMock,
  unarchiveCohortByIdMock,
  addScenarioToCohortMock,
  removeScenarioFromCohortMock,
  generateCohortInviteMock
} = vi.hoisted(() => ({
  getCohortsMock: vi.fn(),
  getCohortByIdMock: vi.fn(),
  restoreCohortByIdMock: vi.fn(),
  updateCohortByIdMock: vi.fn(),
  deleteCohortByIdMock: vi.fn(),
  createCohortMock: vi.fn(),
  duplicateCohortMock: vi.fn(),
  archiveCohortByIdMock: vi.fn(),
  unarchiveCohortByIdMock: vi.fn(),
  addScenarioToCohortMock: vi.fn(),
  removeScenarioFromCohortMock: vi.fn(),
  generateCohortInviteMock: vi.fn()
}));

vi.mock('../services/getCohorts.js', () => ({ default: (...args) => getCohortsMock(...args) }));
vi.mock('../services/getCohortById.js', () => ({ default: (...args) => getCohortByIdMock(...args) }));
vi.mock('../services/restoreCohortById.js', () => ({ default: (...args) => restoreCohortByIdMock(...args) }));
vi.mock('../services/updateCohortById.js', () => ({ default: (...args) => updateCohortByIdMock(...args) }));
vi.mock('../services/deleteCohortById.js', () => ({ default: (...args) => deleteCohortByIdMock(...args) }));
vi.mock('../services/createCohort.js', () => ({ default: (...args) => createCohortMock(...args) }));
vi.mock('../services/duplicateCohort.js', () => ({ default: (...args) => duplicateCohortMock(...args) }));
vi.mock('../services/archiveCohortById.js', () => ({ default: (...args) => archiveCohortByIdMock(...args) }));
vi.mock('../services/unarchiveCohortById.js', () => ({ default: (...args) => unarchiveCohortByIdMock(...args) }));
vi.mock('../services/addScenarioToCohort.js', () => ({ default: (...args) => addScenarioToCohortMock(...args) }));
vi.mock('../services/removeScenarioFromCohort.js', () => ({ default: (...args) => removeScenarioFromCohortMock(...args) }));
vi.mock('../services/generateCohortInvite.js', () => ({ default: (...args) => generateCohortInviteMock(...args) }));
vi.mock('../services/getPublishedCohortById.js', () => ({ default: vi.fn() }));

import controller from '../cohorts.controller.js';

describe('cohorts.controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('all', () => {
    it('forwards search/page/sort/access/archived/deleted to getCohorts', async () => {
      getCohortsMock.mockResolvedValue({ cohorts: [] });
      await controller.all({
        query: { searchValue: 'foo', currentPage: 2, sortBy: 'NEWEST', accessType: 'OWNER', isArchived: false, isDeleted: false }
      }, { ctx: 1 });

      expect(getCohortsMock).toHaveBeenCalledWith(
        { accessType: 'OWNER' },
        { searchValue: 'foo', currentPage: 2, sortBy: 'NEWEST', isArchived: false, isDeleted: false },
        { ctx: 1 }
      );
    });
  });

  describe('create', () => {
    it('routes to duplicateCohort when cohortId is in the body', async () => {
      duplicateCohortMock.mockResolvedValue({ _id: 'c-new' });
      const result = await controller.create({ body: { cohortId: 'c-src' } }, {});
      expect(duplicateCohortMock).toHaveBeenCalledWith({ cohortId: 'c-src' }, {}, {});
      expect(createCohortMock).not.toHaveBeenCalled();
      expect(result).toEqual({ cohort: { _id: 'c-new' } });
    });

    it('routes to createCohort otherwise', async () => {
      createCohortMock.mockResolvedValue({ _id: 'c1' });
      const result = await controller.create({ body: { name: 'New Cohort' } }, {});
      expect(createCohortMock).toHaveBeenCalledWith({ name: 'New Cohort' }, {}, {});
      expect(result).toEqual({ cohort: { _id: 'c1' } });
    });
  });

  describe('read', () => {
    it('looks up by URL param and wraps under "cohort"', async () => {
      getCohortByIdMock.mockResolvedValue({ _id: 'c1' });
      const result = await controller.read({ param: 'c1' }, {});
      expect(getCohortByIdMock).toHaveBeenCalledWith({ cohortId: 'c1' }, {}, {});
      expect(result).toEqual({ cohort: { _id: 'c1' } });
    });
  });

  describe('update', () => {
    it('routes to generateCohortInvite when intent is CREATE_INVITE', async () => {
      generateCohortInviteMock.mockResolvedValue({ _id: 'c1' });
      const result = await controller.update({ param: 'c1', body: { intent: 'CREATE_INVITE' } }, {});
      expect(generateCohortInviteMock).toHaveBeenCalledWith({ cohortId: 'c1' }, {}, {});
      expect(result).toEqual({ cohort: { _id: 'c1' } });
    });

    it('routes to addScenarioToCohort when scenarioId + intent ADD', async () => {
      addScenarioToCohortMock.mockResolvedValue({ _id: 'c1' });
      const result = await controller.update({
        param: 'c1', body: { scenarioId: 's1', intent: 'ADD' }
      }, {});
      expect(addScenarioToCohortMock).toHaveBeenCalledWith({ cohortId: 'c1', update: { scenarioId: 's1', intent: 'ADD' } }, {}, {});
      expect(result).toEqual({ cohort: { _id: 'c1' } });
    });

    it('routes to removeScenarioFromCohort when scenarioId + intent REMOVE', async () => {
      removeScenarioFromCohortMock.mockResolvedValue({ _id: 'c1' });
      const result = await controller.update({
        param: 'c1', body: { scenarioId: 's1', intent: 'REMOVE' }
      }, {});
      expect(removeScenarioFromCohortMock).toHaveBeenCalled();
      expect(result).toEqual({ cohort: { _id: 'c1' } });
    });

    it('routes to restoreCohortById when isDeleted is in the body', async () => {
      restoreCohortByIdMock.mockResolvedValue({ _id: 'c1' });
      const result = await controller.update({ param: 'c1', body: { isDeleted: false } }, {});
      expect(restoreCohortByIdMock).toHaveBeenCalledWith({ cohortId: 'c1' }, {}, {});
      expect(result).toEqual({ cohort: { _id: 'c1' } });
    });

    it('routes to archiveCohortById when isArchived is true', async () => {
      archiveCohortByIdMock.mockResolvedValue({ _id: 'c1' });
      const result = await controller.update({ param: 'c1', body: { isArchived: true } }, {});
      expect(archiveCohortByIdMock).toHaveBeenCalled();
      expect(unarchiveCohortByIdMock).not.toHaveBeenCalled();
      expect(result).toEqual({ cohort: { _id: 'c1' } });
    });

    it('routes to unarchiveCohortById when isArchived is false', async () => {
      unarchiveCohortByIdMock.mockResolvedValue({ _id: 'c1' });
      const result = await controller.update({ param: 'c1', body: { isArchived: false } }, {});
      expect(unarchiveCohortByIdMock).toHaveBeenCalled();
      expect(archiveCohortByIdMock).not.toHaveBeenCalled();
      expect(result).toEqual({ cohort: { _id: 'c1' } });
    });

    it('routes to updateCohortById otherwise', async () => {
      updateCohortByIdMock.mockResolvedValue({ _id: 'c1', name: 'New' });
      const result = await controller.update({ param: 'c1', body: { name: 'New' } }, {});
      expect(updateCohortByIdMock).toHaveBeenCalledWith({ cohortId: 'c1', update: { name: 'New' } }, {}, {});
      expect(result).toEqual({ cohort: { _id: 'c1', name: 'New' } });
    });
  });

  describe('delete', () => {
    it('soft-deletes via deleteCohortById and wraps under "cohort"', async () => {
      deleteCohortByIdMock.mockResolvedValue({ _id: 'c1', isDeleted: true });
      const result = await controller.delete({ param: 'c1' }, {});
      expect(deleteCohortByIdMock).toHaveBeenCalledWith({ cohortId: 'c1' }, {}, {});
      expect(result).toEqual({ cohort: { _id: 'c1', isDeleted: true } });
    });
  });
});
