import { describe, it, expect, vi } from 'vitest';
import getScenarios from '../services/getScenarios.js';

const buildModels = (scenarios = [], count = scenarios.length) => ({
  Scenario: {
    countDocuments: vi.fn().mockResolvedValue(count),
    find: vi.fn(() => ({ sort: vi.fn().mockResolvedValue(scenarios) }))
  }
});

const baseUser = { _id: 'u1' };

describe('getScenarios', () => {
  it('searches with isDeleted=false by default', async () => {
    const models = buildModels();
    await getScenarios({}, {}, { models, user: baseUser });
    expect(models.Scenario.countDocuments).toHaveBeenCalledWith(expect.objectContaining({ isDeleted: false }));
  });

  it('builds a name regex search when searchValue is set', async () => {
    const models = buildModels();
    await getScenarios({}, { searchValue: 'spring' }, { models, user: baseUser });
    const search = models.Scenario.countDocuments.mock.calls[0][0];
    expect(search.$or).toEqual([{ name: { $regex: 'spring', $options: 'i' } }]);
  });

  it('filters by user collaborator role for non-super-admins', async () => {
    const models = buildModels();
    await getScenarios({}, {}, { models, user: baseUser });
    const search = models.Scenario.countDocuments.mock.calls[0][0];
    expect(search.collaborators).toEqual({
      $elemMatch: { user: 'u1', role: { $in: ['OWNER', 'AUTHOR'] } }
    });
  });

  it('does not filter by collaborator role for SUPER_ADMIN', async () => {
    const models = buildModels();
    await getScenarios({}, {}, { models, user: { ...baseUser, role: 'SUPER_ADMIN' } });
    const search = models.Scenario.countDocuments.mock.calls[0][0];
    expect(search.collaborators).toBeUndefined();
  });

  it('filters by accessType when provided', async () => {
    const models = buildModels();
    await getScenarios({ accessType: 'PUBLIC' }, {}, { models, user: baseUser });
    expect(models.Scenario.countDocuments.mock.calls[0][0].accessType).toBe('PUBLIC');
  });

  it.each([
    ['NEWEST', '-createdAt'],
    ['OLDEST', 'createdAt']
  ])('sorts by %s', async (sortBy, expected) => {
    const sortMock = vi.fn().mockResolvedValue([]);
    const models = {
      Scenario: {
        countDocuments: vi.fn().mockResolvedValue(0),
        find: vi.fn(() => ({ sort: sortMock }))
      }
    };
    await getScenarios({}, { sortBy }, { models, user: baseUser });
    expect(sortMock).toHaveBeenCalledWith(expected);
  });

  it('sorts by name by default', async () => {
    const sortMock = vi.fn().mockResolvedValue([]);
    const models = {
      Scenario: {
        countDocuments: vi.fn().mockResolvedValue(0),
        find: vi.fn(() => ({ sort: sortMock }))
      }
    };
    await getScenarios({}, {}, { models, user: baseUser });
    expect(sortMock).toHaveBeenCalledWith('name');
  });

  it('returns scenarios, count, currentPage, totalPages', async () => {
    const models = buildModels([{ _id: 's1' }], 1);
    const result = await getScenarios({}, {}, { models, user: baseUser });
    expect(result).toEqual({ scenarios: [{ _id: 's1' }], count: 1, currentPage: 1, totalPages: 1 });
  });
});
