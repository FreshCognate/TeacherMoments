import { describe, it, expect, vi, beforeEach } from 'vitest';

const { createExportMock, getExportByIdMock, deleteExportMock } = vi.hoisted(() => ({
  createExportMock: vi.fn(),
  getExportByIdMock: vi.fn(),
  deleteExportMock: vi.fn()
}));

vi.mock('../services/createExport.js', () => ({ default: (...args) => createExportMock(...args) }));
vi.mock('../services/getExportById.js', () => ({ default: (...args) => getExportByIdMock(...args) }));
vi.mock('../services/deleteExport.js', () => ({ default: (...args) => deleteExportMock(...args) }));

import controller from '../exports.controller.js';

describe('exports.controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('forwards exportType, scenarioId, cohortId, userId from the body', async () => {
      createExportMock.mockResolvedValue({ export: { _id: 'e1' }, jobId: 'j1' });

      const result = await controller.create({
        body: { exportType: 'COHORT_USER', scenarioId: 's1', cohortId: 'c1', userId: 'u-other' }
      }, { ctx: 1 });

      expect(createExportMock).toHaveBeenCalledWith(
        { exportType: 'COHORT_USER', scenarioId: 's1', cohortId: 'c1', userId: 'u-other' },
        {},
        { ctx: 1 }
      );
      expect(result).toEqual({ export: { _id: 'e1' }, jobId: 'j1' });
    });
  });

  describe('read', () => {
    it('looks up by URL param', async () => {
      getExportByIdMock.mockResolvedValue({ export: { _id: 'e1' }, downloadUrl: null });

      const result = await controller.read({ param: 'e1' }, { ctx: 1 });

      expect(getExportByIdMock).toHaveBeenCalledWith({ exportId: 'e1' }, {}, { ctx: 1 });
      expect(result).toEqual({ export: { _id: 'e1' }, downloadUrl: null });
    });
  });

  describe('delete', () => {
    it('deletes by URL param', async () => {
      deleteExportMock.mockResolvedValue({ success: true });

      const result = await controller.delete({ param: 'e1' }, { ctx: 1 });

      expect(deleteExportMock).toHaveBeenCalledWith({ exportId: 'e1' }, {}, { ctx: 1 });
      expect(result).toEqual({ success: true });
    });
  });
});
