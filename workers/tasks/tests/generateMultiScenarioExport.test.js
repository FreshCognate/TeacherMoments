import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const {
  connectDatabaseMock,
  buildScenarioCsvRowsMock,
  rowsToCsvBufferMock,
  uploadExportToS3Mock,
  waitForS3ObjectMock
} = vi.hoisted(() => ({
  connectDatabaseMock: vi.fn(),
  buildScenarioCsvRowsMock: vi.fn(),
  rowsToCsvBufferMock: vi.fn(),
  uploadExportToS3Mock: vi.fn(),
  waitForS3ObjectMock: vi.fn()
}));

vi.mock('../../../backend/core/databases/helpers/connectDatabase.js', () => ({
  default: (...args) => connectDatabaseMock(...args)
}));
vi.mock('../../../backend/modules/exports/helpers/buildScenarioCsvRows.js', () => ({
  default: (...args) => buildScenarioCsvRowsMock(...args)
}));
vi.mock('../../../backend/modules/exports/helpers/rowsToCsvBuffer.js', () => ({
  default: (...args) => rowsToCsvBufferMock(...args)
}));
vi.mock('../../../backend/modules/exports/helpers/uploadExportToS3.js', () => ({
  default: (...args) => uploadExportToS3Mock(...args)
}));
vi.mock('../../../backend/modules/exports/helpers/waitForS3Object.js', () => ({
  default: (...args) => waitForS3ObjectMock(...args)
}));

import generateMultiScenarioExport from '../generateMultiScenarioExport.js';

const buildModels = ({ scenarios = [], cohortUsers = [], runs = [], userRecords = [] } = {}) => {
  const exportFindByIdAndUpdate = vi.fn().mockResolvedValue();

  const scenarioFind = vi.fn(() => ({
    sort: vi.fn(() => ({ lean: vi.fn().mockResolvedValue(scenarios) }))
  }));

  const runFind = vi.fn(() => ({ lean: vi.fn().mockResolvedValue(runs) }));
  const userFind = vi.fn(() => ({ lean: vi.fn().mockResolvedValue(userRecords) }));

  return {
    models: {
      Export: { findByIdAndUpdate: exportFindByIdAndUpdate },
      Scenario: { find: scenarioFind },
      Run: { find: runFind },
      User: { find: userFind }
    },
    exportFindByIdAndUpdate,
    scenarioFind,
    runFind,
    userFind
  };
};

describe('generateMultiScenarioExport', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    buildScenarioCsvRowsMock.mockResolvedValue([['header'], ['row1']]);
    rowsToCsvBufferMock.mockResolvedValue(Buffer.from('csv'));
    uploadExportToS3Mock.mockResolvedValue();
    waitForS3ObjectMock.mockResolvedValue();
  });

  it('COHORT_USER: looks up cohort scenarios and a single user', async () => {
    const setup = buildModels({
      scenarios: [{ _id: 's1', name: 'A' }],
      userRecords: [{ _id: 'u1' }]
    });
    connectDatabaseMock.mockResolvedValue({ models: setup.models, close: vi.fn() });

    await generateMultiScenarioExport({
      exportId: 'e1',
      exportType: 'COHORT_USER',
      cohortId: 'c1',
      userId: 'u1'
    });

    expect(setup.scenarioFind).toHaveBeenCalledWith({ 'cohorts.cohort': 'c1', isDeleted: false });
    expect(setup.userFind).toHaveBeenCalledWith({ _id: 'u1', isDeleted: false });
  });

  it('COHORT_ALL: looks up cohort scenarios and all cohort users', async () => {
    const setup = buildModels({
      scenarios: [{ _id: 's1', name: 'A' }],
      userRecords: [{ _id: 'u1' }, { _id: 'u2' }]
    });
    connectDatabaseMock.mockResolvedValue({ models: setup.models, close: vi.fn() });

    await generateMultiScenarioExport({
      exportId: 'e1',
      exportType: 'COHORT_ALL',
      cohortId: 'c1'
    });

    expect(setup.userFind).toHaveBeenCalledWith({ 'cohorts.cohort': 'c1', isDeleted: false });
  });

  it('USER_HISTORY: resolves scenarios from de-duplicated user runs', async () => {
    const setup = buildModels({
      scenarios: [{ _id: 's1', name: 'A' }, { _id: 's2', name: 'B' }],
      runs: [{ scenario: 's1' }, { scenario: 's2' }, { scenario: 's1' }],
      userRecords: [{ _id: 'u1' }]
    });
    connectDatabaseMock.mockResolvedValue({ models: setup.models, close: vi.fn() });

    await generateMultiScenarioExport({
      exportId: 'e1',
      exportType: 'USER_HISTORY',
      userId: 'u1'
    });

    expect(setup.runFind).toHaveBeenCalledWith({ user: 'u1', isDeleted: false });
    expect(setup.scenarioFind).toHaveBeenCalledWith({
      _id: { $in: ['s1', 's2'] },
      isDeleted: false
    });
  });

  it('skips scenarios whose row build returned only the header (rows.length <= 1)', async () => {
    const setup = buildModels({
      scenarios: [{ _id: 's1', name: 'Empty' }, { _id: 's2', name: 'Populated' }],
      userRecords: [{ _id: 'u1' }]
    });
    connectDatabaseMock.mockResolvedValue({ models: setup.models, close: vi.fn() });

    buildScenarioCsvRowsMock
      .mockResolvedValueOnce([['header']])           // s1 — only header → skipped
      .mockResolvedValueOnce([['header'], ['row1']]); // s2 — kept

    await generateMultiScenarioExport({
      exportId: 'e1',
      exportType: 'COHORT_USER',
      cohortId: 'c1',
      userId: 'u1'
    });

    // rowsToCsvBuffer should only run once (for s2)
    expect(rowsToCsvBufferMock).toHaveBeenCalledTimes(1);
  });

  it('uploads a zip and marks COMPLETED with zip metadata', async () => {
    const setup = buildModels({
      scenarios: [{ _id: 's1', name: 'Scn' }],
      userRecords: [{ _id: 'u1' }]
    });
    connectDatabaseMock.mockResolvedValue({ models: setup.models, close: vi.fn() });

    await generateMultiScenarioExport({
      exportId: 'e1',
      exportType: 'COHORT_USER',
      cohortId: 'c1',
      userId: 'u1'
    });

    expect(uploadExportToS3Mock).toHaveBeenCalledWith(expect.objectContaining({
      filePath: 'exports/e1/export.zip',
      contentType: 'application/zip',
      contentDisposition: 'attachment; filename="export.zip"'
    }));

    // Final status update is COMPLETED
    expect(setup.exportFindByIdAndUpdate).toHaveBeenLastCalledWith(
      'e1',
      expect.objectContaining({ status: 'COMPLETED', fileName: 'export.zip', filePath: 'exports/e1/export.zip' })
    );
  });
});
