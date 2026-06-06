import { describe, it, expect, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';
import checkHasAccessToScenario from '../helpers/checkHasAccessToScenario.js';

const db = setupMongo();

const scenarioWithCollaborator = (userId) => db.models.Scenario.create({
  name: 'S',
  collaborators: [{ user: userId, role: 'OWNER' }]
});

describe('checkHasAccessToScenario (in-memory mongo)', () => {
  beforeEach(() => {});

  it('grants access for SUPER_ADMIN without resolving the scenario', async () => {
    await expect(
      checkHasAccessToScenario(
        { modelId: new mongoose.Types.ObjectId(), modelType: 'Slide' },
        { user: { _id: new mongoose.Types.ObjectId(), role: 'SUPER_ADMIN' }, models: db.models }
      )
    ).resolves.toBeUndefined();
  });

  it('grants access when the user is a collaborator on the scenario directly', async () => {
    const userId = new mongoose.Types.ObjectId();
    const scenario = await scenarioWithCollaborator(userId);

    await expect(
      checkHasAccessToScenario(
        { modelId: scenario._id, modelType: 'Scenario' },
        { user: { _id: userId }, models: db.models }
      )
    ).resolves.toBeUndefined();
  });

  it('resolves the scenario id from a dependent Slide and grants access', async () => {
    const userId = new mongoose.Types.ObjectId();
    const scenario = await scenarioWithCollaborator(userId);
    const slide = await db.models.Slide.create({ scenario: scenario._id, stemRef: new mongoose.Types.ObjectId(), sortOrder: 0 });

    await expect(
      checkHasAccessToScenario(
        { modelId: slide._id, modelType: 'Slide' },
        { user: { _id: userId }, models: db.models }
      )
    ).resolves.toBeUndefined();
  });

  it('throws 401 when the dependent model does not yield a scenario id', async () => {
    await expect(
      checkHasAccessToScenario(
        { modelId: new mongoose.Types.ObjectId(), modelType: 'Slide' },
        { user: { _id: new mongoose.Types.ObjectId() }, models: db.models }
      )
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('throws 401 when the user is not a collaborator on the scenario', async () => {
    const scenario = await scenarioWithCollaborator(new mongoose.Types.ObjectId());

    await expect(
      checkHasAccessToScenario(
        { modelId: scenario._id, modelType: 'Scenario' },
        { user: { _id: new mongoose.Types.ObjectId() }, models: db.models }
      )
    ).rejects.toMatchObject({ statusCode: 401, message: 'You do not have access to this scenario' });
  });
});
