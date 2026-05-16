import { describe, it, expect, vi, beforeEach } from 'vitest';

const { checkAccessMock } = vi.hoisted(() => ({ checkAccessMock: vi.fn() }));

vi.mock('../helpers/checkHasAccessToScenario.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));

import getAvailableCollaboratorsByScenarioId from '../services/getAvailableCollaboratorsByScenarioId.js';

const buildModels = ({ scenario, users = [], count = users.length } = {}) => ({
  Scenario: { findById: vi.fn().mockResolvedValue(scenario) },
  User: {
    countDocuments: vi.fn().mockResolvedValue(count),
    find: vi.fn(() => ({ sort: vi.fn().mockResolvedValue(users) }))
  }
});

describe('getAvailableCollaboratorsByScenarioId', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('checks scenario access', async () => {
    const models = buildModels({ scenario: { collaborators: [] } });
    const ctx = { models };
    await getAvailableCollaboratorsByScenarioId({ scenarioId: 's1' }, {}, ctx);
    expect(checkAccessMock).toHaveBeenCalledWith({ modelId: 's1', modelType: 'Scenario' }, ctx);
  });

  it('throws 404 when the scenario does not exist', async () => {
    const models = buildModels({ scenario: null });
    await expect(getAvailableCollaboratorsByScenarioId({ scenarioId: 'missing' }, {}, { models }))
      .rejects.toMatchObject({ statusCode: 404 });
  });

  it('excludes existing collaborators and only returns admin-tier roles', async () => {
    const scenario = { collaborators: [{ user: 'u-existing-1' }, { user: 'u-existing-2' }] };
    const models = buildModels({ scenario });

    await getAvailableCollaboratorsByScenarioId({ scenarioId: 's1' }, {}, { models });

    const search = models.User.countDocuments.mock.calls[0][0];
    expect(search._id).toEqual({ $nin: ['u-existing-1', 'u-existing-2'] });
    expect(search.role).toEqual({ $in: ['SUPER_ADMIN', 'ADMIN', 'FACILITATOR'] });
    expect(search.isDeleted).toBe(false);
  });

  it('searches by firstName/lastName/email when searchValue is set', async () => {
    const scenario = { collaborators: [] };
    const models = buildModels({ scenario });

    await getAvailableCollaboratorsByScenarioId(
      { scenarioId: 's1' },
      { searchValue: 'sam' },
      { models }
    );

    const search = models.User.countDocuments.mock.calls[0][0];
    expect(search.$or).toHaveLength(3);
  });

  it('returns collaborators wrapped with pagination info', async () => {
    const scenario = { collaborators: [] };
    const models = buildModels({ scenario, users: [{ _id: 'u1' }], count: 1 });

    const result = await getAvailableCollaboratorsByScenarioId({ scenarioId: 's1' }, {}, { models });

    expect(result).toEqual({ collaborators: [{ _id: 'u1' }], count: 1, currentPage: 1, totalPages: 1 });
  });
});
