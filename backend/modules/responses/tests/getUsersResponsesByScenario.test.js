import { describe, it, expect, vi, beforeEach } from 'vitest';

const { checkScenarioAccessMock, getScenarioSlidesAndBlocksByRefMock, buildUserScenarioResponseMock } = vi.hoisted(() => ({
  checkScenarioAccessMock: vi.fn(),
  getScenarioSlidesAndBlocksByRefMock: vi.fn(),
  buildUserScenarioResponseMock: vi.fn()
}));

vi.mock('../../scenarios/helpers/checkHasAccessToScenario.js', () => ({ default: (...args) => checkScenarioAccessMock(...args) }));
vi.mock('../helpers/getScenarioSlidesAndBlocksByRef.js', () => ({ default: (...args) => getScenarioSlidesAndBlocksByRefMock(...args) }));
vi.mock('../helpers/buildUserScenarioResponse.js', () => ({ default: (...args) => buildUserScenarioResponseMock(...args) }));

import getUsersResponsesByScenario from '../services/getUsersResponsesByScenario.js';

const buildModels = ({ scenario = { _id: 's1' }, runs = [], users = [], count = users.length } = {}) => ({
  Scenario: { findById: vi.fn(() => ({ lean: vi.fn().mockResolvedValue(scenario) })) },
  Run: { find: vi.fn(() => ({ lean: vi.fn().mockResolvedValue(runs) })) },
  User: {
    countDocuments: vi.fn().mockResolvedValue(count),
    find: vi.fn(() => ({ lean: vi.fn().mockResolvedValue(users) }))
  }
});

describe('getUsersResponsesByScenario', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getScenarioSlidesAndBlocksByRefMock.mockResolvedValue({ slidesByRef: {}, blocksByRef: {} });
    buildUserScenarioResponseMock.mockResolvedValue({ blockResponses: [] });
  });

  it('checks scenario access', async () => {
    const models = buildModels();
    const ctx = { models };

    await getUsersResponsesByScenario({ scenarioId: 's1' }, {}, ctx);

    expect(checkScenarioAccessMock).toHaveBeenCalledWith({ modelId: 's1', modelType: 'Scenario' }, ctx);
  });

  it('queries non-deleted runs for the scenario', async () => {
    const models = buildModels();

    await getUsersResponsesByScenario({ scenarioId: 's1' }, {}, { models });

    expect(models.Run.find).toHaveBeenCalledWith({ scenario: 's1', isDeleted: false });
  });

  it('builds the user list from unique run user ids', async () => {
    const runs = [
      { user: 'u1' },
      { user: 'u2' },
      { user: 'u1' }
    ];
    const models = buildModels({ runs, users: [{ _id: 'u1' }, { _id: 'u2' }] });

    await getUsersResponsesByScenario({ scenarioId: 's1' }, {}, { models });

    const search = models.User.countDocuments.mock.calls[0][0];
    expect(search._id.$in).toEqual(['u1', 'u2']);
  });

  it('builds one response per user', async () => {
    const models = buildModels({
      runs: [{ user: 'u1' }, { user: 'u2' }],
      users: [{ _id: 'u1' }, { _id: 'u2' }]
    });

    const result = await getUsersResponsesByScenario({ scenarioId: 's1' }, {}, { models });

    expect(buildUserScenarioResponseMock).toHaveBeenCalledTimes(2);
    expect(result.responses).toHaveLength(2);
  });
});
