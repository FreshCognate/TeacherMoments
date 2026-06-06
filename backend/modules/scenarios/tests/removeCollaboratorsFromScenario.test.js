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

import removeCollaboratorsFromScenario from '../services/removeCollaboratorsFromScenario.js';

const db = setupMongo();

describe('removeCollaboratorsFromScenario (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
    setScenarioHasChangesMock.mockResolvedValue();
  });

  it('throws 404 when the scenario does not exist', async () => {
    await expect(
      removeCollaboratorsFromScenario(
        { scenarioId: new mongoose.Types.ObjectId(), collaborators: [String(new mongoose.Types.ObjectId())] },
        {},
        { models: db.models, user: {} }
      )
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it('pulls the matching collaborators from the scenario', async () => {
    const u1 = new mongoose.Types.ObjectId();
    const u2 = new mongoose.Types.ObjectId();
    const u3 = new mongoose.Types.ObjectId();

    const scenario = await db.models.Scenario.create({
      name: 'S',
      collaborators: [
        { user: u1, role: 'AUTHOR' },
        { user: u2, role: 'AUTHOR' },
        { user: u3, role: 'OWNER' }
      ]
    });

    await removeCollaboratorsFromScenario(
      { scenarioId: scenario._id, collaborators: [String(u1), String(u2)] },
      {},
      { models: db.models, user: {} }
    );

    const stored = await db.models.Scenario.findById(scenario._id).lean();
    expect(map(stored.collaborators, (c) => String(c.user))).toEqual([String(u3)]);
  });

  it('marks the scenario as having changes', async () => {
    const scenario = await db.models.Scenario.create({ name: 'S' });
    const ctx = { models: db.models, user: {} };

    await removeCollaboratorsFromScenario(
      { scenarioId: scenario._id, collaborators: [String(new mongoose.Types.ObjectId())] },
      {},
      ctx
    );

    expect(setScenarioHasChangesMock).toHaveBeenCalledWith({ scenarioId: scenario._id }, {}, ctx);
  });
});
