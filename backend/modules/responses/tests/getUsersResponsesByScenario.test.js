import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';

const { checkScenarioAccessMock, getScenarioSlidesAndBlocksByRefMock, buildUserScenarioResponseMock } = vi.hoisted(() => ({
  checkScenarioAccessMock: vi.fn(),
  getScenarioSlidesAndBlocksByRefMock: vi.fn(),
  buildUserScenarioResponseMock: vi.fn()
}));

vi.mock('../../scenarios/helpers/checkHasAccessToScenario.js', () => ({ default: (...args) => checkScenarioAccessMock(...args) }));
vi.mock('../helpers/getScenarioSlidesAndBlocksByRef.js', () => ({ default: (...args) => getScenarioSlidesAndBlocksByRefMock(...args) }));
vi.mock('../helpers/buildUserScenarioResponse.js', () => ({ default: (...args) => buildUserScenarioResponseMock(...args) }));

import getUsersResponsesByScenario from '../services/getUsersResponsesByScenario.js';

const db = setupMongo();

describe('getUsersResponsesByScenario (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkScenarioAccessMock.mockResolvedValue();
    getScenarioSlidesAndBlocksByRefMock.mockResolvedValue({ slidesByRef: {}, blocksByRef: {} });
    buildUserScenarioResponseMock.mockResolvedValue({ blockResponses: [] });
  });

  it('checks scenario access', async () => {
    const scenario = await db.models.Scenario.create({ name: 'S' });
    const ctx = { models: db.models };
    await getUsersResponsesByScenario({ scenarioId: scenario._id }, {}, ctx);
    expect(checkScenarioAccessMock).toHaveBeenCalledWith({ modelId: scenario._id, modelType: 'Scenario' }, ctx);
  });

  it('builds one response per unique user from non-deleted runs', async () => {
    const scenario = await db.models.Scenario.create({ name: 'S' });
    const u1 = await db.models.User.create({ email: 'u1@x.com' });
    const u2 = await db.models.User.create({ email: 'u2@x.com' });
    const u3 = await db.models.User.create({ email: 'u3@x.com' });

    await db.models.Run.create([
      { scenario: scenario._id, user: u1._id },
      { scenario: scenario._id, user: u2._id },
      { scenario: scenario._id, user: u1._id },
      { scenario: scenario._id, user: u3._id, isDeleted: true }
    ]);

    const result = await getUsersResponsesByScenario({ scenarioId: scenario._id }, {}, { models: db.models });

    // u1 + u2 only (u3's run is deleted).
    expect(result.responses).toHaveLength(2);
    expect(buildUserScenarioResponseMock).toHaveBeenCalledTimes(2);
    const responseUserIds = result.responses.map((r) => String(r.user._id)).sort();
    expect(responseUserIds).toEqual([String(u1._id), String(u2._id)].sort());
  });

  it('returns pagination info', async () => {
    const scenario = await db.models.Scenario.create({ name: 'S' });
    const u1 = await db.models.User.create({ email: 'u1@x.com' });
    await db.models.Run.create([{ scenario: scenario._id, user: u1._id }]);

    const result = await getUsersResponsesByScenario({ scenarioId: scenario._id }, {}, { models: db.models });
    expect(result).toMatchObject({ count: 1, currentPage: 1, totalPages: 1 });
  });
});
