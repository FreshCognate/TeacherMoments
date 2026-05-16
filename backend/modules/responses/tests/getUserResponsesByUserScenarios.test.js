import { describe, it, expect, vi, beforeEach } from 'vitest';

const { getScenarioSlidesAndBlocksByRefMock, buildUserScenarioResponseMock } = vi.hoisted(() => ({
  getScenarioSlidesAndBlocksByRefMock: vi.fn(),
  buildUserScenarioResponseMock: vi.fn()
}));

vi.mock('../helpers/getScenarioSlidesAndBlocksByRef.js', () => ({ default: (...args) => getScenarioSlidesAndBlocksByRefMock(...args) }));
vi.mock('../helpers/buildUserScenarioResponse.js', () => ({ default: (...args) => buildUserScenarioResponseMock(...args) }));

import getUserResponsesByUserScenarios from '../services/getUserResponsesByUserScenarios.js';

const buildModels = ({ scenarioIds = [], scenarios = [], count = scenarios.length } = {}) => ({
  Run: { distinct: vi.fn().mockResolvedValue(scenarioIds) },
  Scenario: {
    countDocuments: vi.fn().mockResolvedValue(count),
    find: vi.fn(() => ({
      sort: vi.fn(() => ({ lean: vi.fn().mockResolvedValue(scenarios) }))
    }))
  }
});

describe('getUserResponsesByUserScenarios', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getScenarioSlidesAndBlocksByRefMock.mockResolvedValue({ slidesByRef: {}, blocksByRef: {} });
    buildUserScenarioResponseMock.mockResolvedValue({ blockResponses: [] });
  });

  it('queries distinct scenario ids from the users non-deleted runs', async () => {
    const models = buildModels({ scenarioIds: ['s1', 's2'], scenarios: [] });

    await getUserResponsesByUserScenarios({}, {}, { models, user: { _id: 'u1' } });

    expect(models.Run.distinct).toHaveBeenCalledWith('scenario', { user: 'u1', isDeleted: false });
  });

  it('searches scenarios by id list and isDeleted=false', async () => {
    const models = buildModels({ scenarioIds: ['s1'], scenarios: [{ _id: 's1' }] });

    await getUserResponsesByUserScenarios({}, {}, { models, user: { _id: 'u1' } });

    expect(models.Scenario.countDocuments).toHaveBeenCalledWith(expect.objectContaining({
      _id: { $in: ['s1'] },
      isDeleted: false
    }));
  });

  it('returns one response per scenario', async () => {
    const scenarios = [{ _id: 's1' }, { _id: 's2' }];
    const models = buildModels({ scenarioIds: ['s1', 's2'], scenarios });

    const result = await getUserResponsesByUserScenarios({}, {}, { models, user: { _id: 'u1' } });

    expect(buildUserScenarioResponseMock).toHaveBeenCalledTimes(2);
    expect(result.responses).toHaveLength(2);
  });
});
