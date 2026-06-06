import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import map from 'lodash/map.js';
import { setupMongo } from '../../../../tests/with-mongo.js';

const { checkAccessMock, setScenarioHasChangesMock } = vi.hoisted(() => ({
  checkAccessMock: vi.fn(),
  setScenarioHasChangesMock: vi.fn()
}));

vi.mock('../helpers/checkHasAccessToScenario.js', () => ({ default: (...args) => checkAccessMock(...args) }));
vi.mock('../services/setScenarioHasChanges.js', () => ({ default: (...args) => setScenarioHasChangesMock(...args) }));

import addCollaboratorsToScenario from '../services/addCollaboratorsToScenario.js';

const db = setupMongo();

describe('addCollaboratorsToScenario (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
    setScenarioHasChangesMock.mockResolvedValue();
  });

  it('throws 404 when the scenario does not exist', async () => {
    await expect(
      addCollaboratorsToScenario(
        { scenarioId: new mongoose.Types.ObjectId(), collaborators: [String(new mongoose.Types.ObjectId())] },
        {},
        { models: db.models, user: { _id: new mongoose.Types.ObjectId() } }
      )
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it('adds only collaborators not already on the scenario, with role AUTHOR', async () => {
    const existing = new mongoose.Types.ObjectId();
    const newOne = new mongoose.Types.ObjectId();
    const newTwo = new mongoose.Types.ObjectId();

    const scenario = await db.models.Scenario.create({
      name: 'S',
      collaborators: [{ user: existing, role: 'OWNER' }]
    });

    await addCollaboratorsToScenario(
      { scenarioId: scenario._id, collaborators: [String(existing), String(newOne), String(newTwo)] },
      {},
      { models: db.models, user: { _id: new mongoose.Types.ObjectId() } }
    );

    const stored = await db.models.Scenario.findById(scenario._id).lean();
    const userIds = map(stored.collaborators, (c) => String(c.user));

    expect(userIds).toContain(String(newOne));
    expect(userIds).toContain(String(newTwo));
    // Existing collaborator is not duplicated.
    expect(userIds.filter((id) => id === String(existing))).toHaveLength(1);

    const added = stored.collaborators.find((c) => String(c.user) === String(newOne));
    expect(added.role).toBe('AUTHOR');
  });

  it('marks the scenario as having changes', async () => {
    const scenario = await db.models.Scenario.create({ name: 'S' });
    const ctx = { models: db.models, user: { _id: new mongoose.Types.ObjectId() } };

    await addCollaboratorsToScenario(
      { scenarioId: scenario._id, collaborators: [String(new mongoose.Types.ObjectId())] },
      {},
      ctx
    );

    expect(setScenarioHasChangesMock).toHaveBeenCalledWith({ scenarioId: scenario._id }, {}, ctx);
  });
});
