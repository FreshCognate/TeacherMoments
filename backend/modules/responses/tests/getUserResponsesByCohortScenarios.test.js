import { describe, it, expect, vi, beforeEach } from 'vitest';

const { checkCohortViewMock, getScenarioSlidesAndBlocksByRefMock, buildUserScenarioResponseMock } = vi.hoisted(() => ({
  checkCohortViewMock: vi.fn(),
  getScenarioSlidesAndBlocksByRefMock: vi.fn(),
  buildUserScenarioResponseMock: vi.fn()
}));

vi.mock('../../cohorts/helpers/checkHasAccessToViewCohort.js', () => ({ default: (...args) => checkCohortViewMock(...args) }));
vi.mock('../helpers/getScenarioSlidesAndBlocksByRef.js', () => ({ default: (...args) => getScenarioSlidesAndBlocksByRefMock(...args) }));
vi.mock('../helpers/buildUserScenarioResponse.js', () => ({ default: (...args) => buildUserScenarioResponseMock(...args) }));

import getUserResponsesByCohortScenarios from '../services/getUserResponsesByCohortScenarios.js';

const buildModels = ({ user = null, scenarios = [], count = scenarios.length } = {}) => ({
  User: { findOne: vi.fn(() => ({ lean: vi.fn().mockResolvedValue(user) })) },
  Scenario: {
    countDocuments: vi.fn().mockResolvedValue(count),
    find: vi.fn(() => ({
      sort: vi.fn(() => ({ lean: vi.fn().mockResolvedValue(scenarios) }))
    }))
  }
});

describe('getUserResponsesByCohortScenarios', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getScenarioSlidesAndBlocksByRefMock.mockResolvedValue({ slidesByRef: {}, blocksByRef: {} });
    buildUserScenarioResponseMock.mockResolvedValue({ blockResponses: [] });
  });

  it('checks cohort view access', async () => {
    const models = buildModels({ user: { _id: 'u1' } });
    const ctx = { models };

    await getUserResponsesByCohortScenarios({ userId: 'u1', cohortId: 'c1' }, {}, ctx);

    expect(checkCohortViewMock).toHaveBeenCalledWith({ cohortId: 'c1' }, ctx);
  });

  it('throws 404 when the user is not in the cohort', async () => {
    const models = buildModels({ user: null });

    await expect(getUserResponsesByCohortScenarios(
      { userId: 'u-missing', cohortId: 'c1' },
      {},
      { models }
    )).rejects.toMatchObject({ statusCode: 404 });
  });

  it('looks up the user with the cohort filter', async () => {
    const models = buildModels({ user: { _id: 'u1' } });

    await getUserResponsesByCohortScenarios({ userId: 'u1', cohortId: 'c1' }, {}, { models });

    expect(models.User.findOne).toHaveBeenCalledWith({ _id: 'u1', 'cohorts.cohort': 'c1' });
  });

  it('searches scenarios by name when searchValue is provided', async () => {
    const models = buildModels({ user: { _id: 'u1' } });

    await getUserResponsesByCohortScenarios(
      { userId: 'u1', cohortId: 'c1' },
      { searchValue: 'spring' },
      { models }
    );

    const search = models.Scenario.countDocuments.mock.calls[0][0];
    expect(search.$or).toEqual([{ name: { $regex: 'spring', $options: 'i' } }]);
  });

  it('builds responses for each scenario the user is in', async () => {
    const user = { _id: 'u1' };
    const scenarios = [{ _id: 's1' }, { _id: 's2' }];
    const models = buildModels({ user, scenarios });

    buildUserScenarioResponseMock.mockResolvedValue({ blockResponses: [], hasStarted: true });

    const result = await getUserResponsesByCohortScenarios(
      { userId: 'u1', cohortId: 'c1' },
      {},
      { models }
    );

    expect(buildUserScenarioResponseMock).toHaveBeenCalledTimes(2);
    expect(result.responses).toHaveLength(2);
    expect(result.user).toBe(user);
    expect(result.count).toBe(2);
    expect(result.totalPages).toBe(1);
  });
});
