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

import generateScenarioExport from '../generateScenarioExport.js';

const FIXED_NOW = new Date('2026-05-08T12:00:00Z');

const buildModels = ({ scenarioName = 'My scenario', cohortUsers = [], runUserIds = [], users = [] } = {}) => {
  const exportFindByIdAndUpdate = vi.fn().mockResolvedValue();
  const scenarioFindById = vi.fn(() => ({ lean: vi.fn().mockResolvedValue({ name: scenarioName }) }));

  const runs = runUserIds.map((u) => ({ user: u }));
  const runFind = vi.fn(() => ({ lean: vi.fn().mockResolvedValue(runs) }));

  const userFind = vi.fn(() => ({ lean: vi.fn().mockResolvedValue(users) }));

  return {
    models: {
      Export: { findByIdAndUpdate: exportFindByIdAndUpdate },
      Scenario: { findById: scenarioFindById },
      Run: { find: runFind },
      User: { find: userFind }
    },
    exportFindByIdAndUpdate,
    scenarioFindById,
    runFind,
    userFind
  };
};

describe('generateScenarioExport', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    buildScenarioCsvRowsMock.mockResolvedValue([['header'], ['row1']]);
    rowsToCsvBufferMock.mockResolvedValue(Buffer.from('csv,data'));
    uploadExportToS3Mock.mockResolvedValue();
    waitForS3ObjectMock.mockResolvedValue();
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('marks export PROCESSING, looks up cohort users for COHORT_SCENARIO, uploads, and marks COMPLETED', async () => {
    const setup = buildModels({ users: [{ _id: 'u1' }, { _id: 'u2' }] });
    connectDatabaseMock.mockResolvedValue({ models: setup.models, close: vi.fn() });

    await generateScenarioExport({
      exportId: 'e1',
      exportType: 'COHORT_SCENARIO',
      scenarioId: 's1',
      cohortId: 'c1'
    });

    expect(setup.exportFindByIdAndUpdate).toHaveBeenNthCalledWith(1, 'e1', { status: 'PROCESSING' });
    expect(setup.userFind).toHaveBeenCalledWith({ 'cohorts.cohort': 'c1', isDeleted: false });
    expect(setup.runFind).not.toHaveBeenCalled();

    expect(buildScenarioCsvRowsMock).toHaveBeenCalledWith({
      scenarioId: 's1',
      users: [{ _id: 'u1' }, { _id: 'u2' }],
      models: setup.models
    });

    expect(uploadExportToS3Mock).toHaveBeenCalledWith(expect.objectContaining({
      contentType: 'text/csv',
      contentDisposition: 'attachment; filename="My_scenario_responses.csv"'
    }));
    expect(waitForS3ObjectMock).toHaveBeenCalled();

    expect(setup.exportFindByIdAndUpdate).toHaveBeenNthCalledWith(2, 'e1', {
      status: 'COMPLETED',
      fileName: 'My_scenario_responses.csv',
      filePath: 'exports/e1/My_scenario_responses.csv',
      fileSize: Buffer.from('csv,data').length,
      completedAt: FIXED_NOW
    });
  });

  it('resolves users from de-duplicated Run.user for non-COHORT_SCENARIO exports', async () => {
    const setup = buildModels({
      runUserIds: ['u1', 'u2', 'u1'], // duplicate u1 — should be deduped
      users: [{ _id: 'u1' }, { _id: 'u2' }]
    });
    connectDatabaseMock.mockResolvedValue({ models: setup.models, close: vi.fn() });

    await generateScenarioExport({
      exportId: 'e1',
      exportType: 'SCENARIO',
      scenarioId: 's1'
    });

    expect(setup.runFind).toHaveBeenCalledWith({ scenario: 's1', isDeleted: false });
    expect(setup.userFind).toHaveBeenCalledWith({
      _id: { $in: ['u1', 'u2'] },
      isDeleted: false
    });
  });

  it('falls back to "export" + sanitises invalid filename characters from the scenario name', async () => {
    const setup = buildModels({ scenarioName: 'My / Scenario!?', users: [] });
    connectDatabaseMock.mockResolvedValue({ models: setup.models, close: vi.fn() });

    await generateScenarioExport({
      exportId: 'e1',
      exportType: 'COHORT_SCENARIO',
      scenarioId: 's1',
      cohortId: 'c1'
    });

    expect(uploadExportToS3Mock.mock.calls[0][0].filePath).toBe('exports/e1/My___Scenario___responses.csv');
  });
});
