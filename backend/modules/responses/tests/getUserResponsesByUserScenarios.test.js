import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';

const { getScenarioSlidesAndBlocksByRefMock, buildUserScenarioResponseMock } = vi.hoisted(() => ({
  getScenarioSlidesAndBlocksByRefMock: vi.fn(),
  buildUserScenarioResponseMock: vi.fn()
}));

vi.mock('../helpers/getScenarioSlidesAndBlocksByRef.js', () => ({ default: (...args) => getScenarioSlidesAndBlocksByRefMock(...args) }));
vi.mock('../helpers/buildUserScenarioResponse.js', () => ({ default: (...args) => buildUserScenarioResponseMock(...args) }));

import getUserResponsesByUserScenarios from '../services/getUserResponsesByUserScenarios.js';

const db = setupMongo();

describe('getUserResponsesByUserScenarios (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getScenarioSlidesAndBlocksByRefMock.mockResolvedValue({ slidesByRef: {}, blocksByRef: {} });
    buildUserScenarioResponseMock.mockResolvedValue({ blockResponses: [] });
  });

  it('returns one response per scenario the user has a non-deleted run in', async () => {
    const userId = new mongoose.Types.ObjectId();
    const s1 = await db.models.Scenario.create({ name: 'S1' });
    const s2 = await db.models.Scenario.create({ name: 'S2' });
    const s3 = await db.models.Scenario.create({ name: 'S3' });

    await db.models.Run.create([
      { scenario: s1._id, user: userId },
      { scenario: s2._id, user: userId },
      // Deleted run — its scenario must not appear.
      { scenario: s3._id, user: userId, isDeleted: true }
    ]);

    const result = await getUserResponsesByUserScenarios({}, {}, { models: db.models, user: { _id: userId } });

    expect(buildUserScenarioResponseMock).toHaveBeenCalledTimes(2);
    const scenarioIds = result.responses.map((r) => String(r.scenario._id)).sort();
    expect(scenarioIds).toEqual([String(s1._id), String(s2._id)].sort());
    expect(result.count).toBe(2);
  });

  it('returns no responses when the user has no runs', async () => {
    const result = await getUserResponsesByUserScenarios({}, {}, { models: db.models, user: { _id: new mongoose.Types.ObjectId() } });
    expect(result.responses).toHaveLength(0);
    expect(result.count).toBe(0);
  });
});
