import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';

const { checkAccessMock } = vi.hoisted(() => ({ checkAccessMock: vi.fn() }));

vi.mock('../helpers/checkHasAccessToScenario.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));

import getAvailableCollaboratorsByScenarioId from '../services/getAvailableCollaboratorsByScenarioId.js';

const db = setupMongo();

describe('getAvailableCollaboratorsByScenarioId (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
  });

  it('checks scenario access', async () => {
    const scenario = await db.models.Scenario.create({ name: 'S' });
    const ctx = { models: db.models };
    await getAvailableCollaboratorsByScenarioId({ scenarioId: scenario._id }, {}, ctx);
    expect(checkAccessMock).toHaveBeenCalledWith({ modelId: scenario._id, modelType: 'Scenario' }, ctx);
  });

  it('throws 404 when the scenario does not exist', async () => {
    await expect(
      getAvailableCollaboratorsByScenarioId({ scenarioId: new mongoose.Types.ObjectId() }, {}, { models: db.models })
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it('excludes existing collaborators and only returns admin-tier roles', async () => {
    const existingAdmin = await db.models.User.create({ email: 'existing@x.com', lastName: 'Existing', role: 'ADMIN' });
    const availableAdmin = await db.models.User.create({ email: 'admin@x.com', lastName: 'Admin', role: 'ADMIN' });
    const availableFacilitator = await db.models.User.create({ email: 'fac@x.com', lastName: 'Fac', role: 'FACILITATOR' });
    await db.models.User.create({ email: 'participant@x.com', lastName: 'Part', role: 'PARTICIPANT' });

    const scenario = await db.models.Scenario.create({
      name: 'S',
      collaborators: [{ user: existingAdmin._id, role: 'OWNER' }]
    });

    const { collaborators } = await getAvailableCollaboratorsByScenarioId(
      { scenarioId: scenario._id }, {}, { models: db.models }
    );

    const ids = collaborators.map((u) => String(u._id));
    expect(ids).toContain(String(availableAdmin._id));
    expect(ids).toContain(String(availableFacilitator._id));
    expect(ids).not.toContain(String(existingAdmin._id));
    // No PARTICIPANT-tier users.
    expect(collaborators.every((u) => ['SUPER_ADMIN', 'ADMIN', 'FACILITATOR'].includes(u.role))).toBe(true);
  });

  it('searches by firstName/lastName/email when searchValue is set', async () => {
    const sam = await db.models.User.create({ email: 'sam@x.com', firstName: 'Sam', lastName: 'Smith', role: 'ADMIN' });
    await db.models.User.create({ email: 'jo@x.com', firstName: 'Jo', lastName: 'Jones', role: 'ADMIN' });

    const scenario = await db.models.Scenario.create({ name: 'S' });

    const { collaborators } = await getAvailableCollaboratorsByScenarioId(
      { scenarioId: scenario._id }, { searchValue: 'sam' }, { models: db.models }
    );

    expect(collaborators.map((u) => String(u._id))).toEqual([String(sam._id)]);
  });

  it('returns collaborators wrapped with pagination info', async () => {
    await db.models.User.create({ email: 'a@x.com', lastName: 'A', role: 'ADMIN' });
    const scenario = await db.models.Scenario.create({ name: 'S' });

    const result = await getAvailableCollaboratorsByScenarioId({ scenarioId: scenario._id }, {}, { models: db.models });

    expect(result).toMatchObject({ count: 1, currentPage: 1, totalPages: 1 });
    expect(result.collaborators).toHaveLength(1);
  });
});
