import { describe, it, expect, vi, beforeEach } from 'vitest';

const {
  getSocketsMock,
  emitMock,
  generateScenarioExportMock,
  generateMultiScenarioExportMock,
  connectDatabaseMock,
  exportFindByIdAndUpdateMock
} = vi.hoisted(() => ({
  getSocketsMock: vi.fn(),
  emitMock: vi.fn(),
  generateScenarioExportMock: vi.fn(),
  generateMultiScenarioExportMock: vi.fn(),
  connectDatabaseMock: vi.fn(),
  exportFindByIdAndUpdateMock: vi.fn()
}));

// Module-side effects (registerModel etc.) — replace with empty modules
vi.mock('../../../backend/core/users/index.js', () => ({}));
vi.mock('../../../backend/modules/exports/index.js', () => ({}));
vi.mock('../../../backend/modules/responses/index.js', () => ({}));
vi.mock('../../../backend/modules/scenarios/index.js', () => ({}));
vi.mock('../../../backend/modules/slides/index.js', () => ({}));
vi.mock('../../../backend/modules/blocks/index.js', () => ({}));
vi.mock('../../../backend/modules/runs/index.js', () => ({}));
vi.mock('../../../backend/modules/assets/index.js', () => ({}));

vi.mock('../../tasks/generateScenarioExport.js', () => ({
  default: (...args) => generateScenarioExportMock(...args)
}));
vi.mock('../../tasks/generateMultiScenarioExport.js', () => ({
  default: (...args) => generateMultiScenarioExportMock(...args)
}));
vi.mock('../../getSockets.js', () => ({
  default: (...args) => getSocketsMock(...args)
}));
vi.mock('../../../backend/core/databases/helpers/connectDatabase.js', () => ({
  default: (...args) => connectDatabaseMock(...args)
}));

import exportsRunner from '../exports.js';

beforeEach(() => {
  vi.clearAllMocks();
  getSocketsMock.mockResolvedValue({ emit: emitMock });
  generateScenarioExportMock.mockResolvedValue();
  generateMultiScenarioExportMock.mockResolvedValue();
  connectDatabaseMock.mockResolvedValue({
    models: { Export: { findByIdAndUpdate: exportFindByIdAndUpdateMock } }
  });
});

describe('exports runner', () => {
  it('routes SCENARIO_RESPONSES / COHORT_SCENARIO to generateScenarioExport', async () => {
    await exportsRunner({
      id: 'j1',
      name: 'GENERATE_EXPORT',
      data: { exportType: 'SCENARIO_RESPONSES', exportId: 'e1', scenarioId: 's1' }
    });

    expect(generateScenarioExportMock).toHaveBeenCalledWith({
      exportType: 'SCENARIO_RESPONSES',
      exportId: 'e1',
      scenarioId: 's1'
    });
    expect(generateMultiScenarioExportMock).not.toHaveBeenCalled();

    await exportsRunner({
      id: 'j2',
      name: 'GENERATE_EXPORT',
      data: { exportType: 'COHORT_SCENARIO', exportId: 'e2' }
    });
    expect(generateScenarioExportMock).toHaveBeenCalledTimes(2);
  });

  it('routes COHORT_USER / COHORT_ALL / USER_HISTORY to generateMultiScenarioExport', async () => {
    for (const exportType of ['COHORT_USER', 'COHORT_ALL', 'USER_HISTORY']) {
      await exportsRunner({
        id: 'j1',
        name: 'GENERATE_EXPORT',
        data: { exportType, exportId: 'e1' }
      });
    }

    expect(generateMultiScenarioExportMock).toHaveBeenCalledTimes(3);
    expect(generateScenarioExportMock).not.toHaveBeenCalled();
  });

  it('emits EXPORT_PROCESSING and EXPORT_COMPLETED with the job id and export id', async () => {
    await exportsRunner({
      id: 'j1',
      name: 'GENERATE_EXPORT',
      data: { exportType: 'COHORT_USER', exportId: 'e1' }
    });

    expect(emitMock).toHaveBeenNthCalledWith(1, 'workers:exports:j1', { event: 'EXPORT_PROCESSING' });
    expect(emitMock).toHaveBeenNthCalledWith(2, 'workers:exports:j1', {
      event: 'EXPORT_COMPLETED',
      exportId: 'e1'
    });
  });

  it('on task failure: marks the Export FAILED, emits EXPORT_FAILED, and re-throws', async () => {
    generateScenarioExportMock.mockRejectedValue(new Error('boom'));

    await expect(
      exportsRunner({
        id: 'j1',
        name: 'GENERATE_EXPORT',
        data: { exportType: 'SCENARIO_RESPONSES', exportId: 'e1' }
      })
    ).rejects.toThrow();

    expect(exportFindByIdAndUpdateMock).toHaveBeenCalledWith('e1', { status: 'FAILED' });
    expect(emitMock).toHaveBeenCalledWith('workers:exports:j1', { event: 'EXPORT_FAILED' });
  });

  it('does nothing for unknown job names', async () => {
    await exportsRunner({ id: 'j1', name: 'UNKNOWN', data: {} });

    expect(generateScenarioExportMock).not.toHaveBeenCalled();
    expect(generateMultiScenarioExportMock).not.toHaveBeenCalled();
    expect(emitMock).not.toHaveBeenCalled();
  });
});
