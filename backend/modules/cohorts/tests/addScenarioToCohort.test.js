import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import find from 'lodash/find.js';
import { setupMongo } from '../../../../tests/with-mongo.js';

const { checkAccessMock, getScenariosCountByCohortIdMock } = vi.hoisted(() => ({
  checkAccessMock: vi.fn(),
  getScenariosCountByCohortIdMock: vi.fn()
}));

vi.mock('../helpers/checkHasAccessToEditCohort.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));

vi.mock('../../scenarios/services/getScenariosCountByCohortId.js', () => ({
  default: (...args) => getScenariosCountByCohortIdMock(...args)
}));

import addScenarioToCohort from '../services/addScenarioToCohort.js';

const db = setupMongo();

describe('addScenarioToCohort (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
    getScenariosCountByCohortIdMock.mockResolvedValue({ count: 3 });
  });

  it('checks edit access', async () => {
    const cohort = await db.models.Cohort.create({ name: 'C' });
    const scenario = await db.models.Scenario.create({ name: 'S' });
    const ctx = { models: db.models, user: { _id: new mongoose.Types.ObjectId() } };
    await addScenarioToCohort({ cohortId: cohort._id, update: { scenarioId: scenario._id } }, {}, ctx);
    expect(checkAccessMock).toHaveBeenCalledWith({ cohortId: cohort._id }, ctx);
  });

  it('pushes the cohort onto the scenario with the next sortOrder', async () => {
    const userId = new mongoose.Types.ObjectId();
    const cohort = await db.models.Cohort.create({ name: 'C' });
    const scenario = await db.models.Scenario.create({ name: 'S' });

    await addScenarioToCohort(
      { cohortId: cohort._id, update: { scenarioId: scenario._id } },
      {},
      { models: db.models, user: { _id: userId } }
    );

    const stored = await db.models.Scenario.findById(scenario._id).lean();
    const link = find(stored.cohorts, (c) => String(c.cohort) === String(cohort._id));
    expect(link).toBeDefined();
    expect(link.sortOrder).toBe(3);
    expect(String(link.addedBy)).toBe(String(userId));
  });

  it('does not add the cohort twice and updates the cohort timestamps', async () => {
    const userId = new mongoose.Types.ObjectId();
    const cohort = await db.models.Cohort.create({ name: 'C' });
    const scenario = await db.models.Scenario.create({ name: 'S' });

    await addScenarioToCohort(
      { cohortId: cohort._id, update: { scenarioId: scenario._id } },
      {},
      { models: db.models, user: { _id: userId } }
    );

    const storedCohort = await db.models.Cohort.findById(cohort._id).lean();
    expect(String(storedCohort.updatedBy)).toBe(String(userId));
    expect(storedCohort.updatedAt).toBeInstanceOf(Date);

    // A second add for an already-linked scenario is a 404 (findOneAndUpdate matches nothing).
    await expect(
      addScenarioToCohort(
        { cohortId: cohort._id, update: { scenarioId: scenario._id } },
        {},
        { models: db.models, user: { _id: userId } }
      )
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it('throws 404 when the scenario is not found', async () => {
    const cohort = await db.models.Cohort.create({ name: 'C' });
    await expect(
      addScenarioToCohort(
        { cohortId: cohort._id, update: { scenarioId: new mongoose.Types.ObjectId() } },
        {},
        { models: db.models, user: { _id: new mongoose.Types.ObjectId() } }
      )
    ).rejects.toMatchObject({ statusCode: 404 });
  });
});
