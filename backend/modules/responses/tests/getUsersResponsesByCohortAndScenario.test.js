import { describe, it, expect, vi, beforeEach } from 'vitest';

const { checkCohortViewMock, getScenarioSlidesAndBlocksByRefMock, buildUserScenarioResponseMock } = vi.hoisted(() => ({
  checkCohortViewMock: vi.fn(),
  getScenarioSlidesAndBlocksByRefMock: vi.fn(),
  buildUserScenarioResponseMock: vi.fn()
}));

vi.mock('../../cohorts/helpers/checkHasAccessToViewCohort.js', () => ({ default: (...args) => checkCohortViewMock(...args) }));
vi.mock('../helpers/getScenarioSlidesAndBlocksByRef.js', () => ({ default: (...args) => getScenarioSlidesAndBlocksByRefMock(...args) }));
vi.mock('../helpers/buildUserScenarioResponse.js', () => ({ default: (...args) => buildUserScenarioResponseMock(...args) }));

import getUsersResponsesByCohortAndScenario from '../services/getUsersResponsesByCohortAndScenario.js';

const buildModels = ({ scenario = { _id: 's1' }, users = [], count = users.length } = {}) => ({
  Scenario: { findById: vi.fn(() => ({ lean: vi.fn().mockResolvedValue(scenario) })) },
  User: {
    countDocuments: vi.fn().mockResolvedValue(count),
    find: vi.fn(() => ({ lean: vi.fn().mockResolvedValue(users) }))
  }
});

describe('getUsersResponsesByCohortAndScenario', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getScenarioSlidesAndBlocksByRefMock.mockResolvedValue({ slidesByRef: {}, blocksByRef: {} });
    buildUserScenarioResponseMock.mockResolvedValue({ blockResponses: [] });
  });

  it('checks cohort view access', async () => {
    const models = buildModels();
    const ctx = { models };

    await getUsersResponsesByCohortAndScenario({ cohortId: 'c1', scenarioId: 's1' }, {}, ctx);

    expect(checkCohortViewMock).toHaveBeenCalledWith({ cohortId: 'c1' }, ctx);
  });

  it('searches users by cohort and username regex', async () => {
    const models = buildModels({ users: [{ _id: 'u1' }] });

    await getUsersResponsesByCohortAndScenario(
      { cohortId: 'c1', scenarioId: 's1' },
      { searchValue: 'sam' },
      { models }
    );

    const search = models.User.countDocuments.mock.calls[0][0];
    expect(search['cohorts.cohort']).toBe('c1');
    expect(search.$or).toEqual([{ username: { $regex: 'sam', $options: 'i' } }]);
  });

  it('builds one response per user with the same scenario', async () => {
    const scenario = { _id: 's1', name: 'Test' };
    const users = [{ _id: 'u1' }, { _id: 'u2' }];
    const models = buildModels({ scenario, users });

    const result = await getUsersResponsesByCohortAndScenario(
      { cohortId: 'c1', scenarioId: 's1' },
      {},
      { models }
    );

    expect(buildUserScenarioResponseMock).toHaveBeenCalledTimes(2);
    expect(result.scenario).toEqual(scenario);
    expect(result.responses).toHaveLength(2);
  });
});
