import { describe, it, expect, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';
import getAvailableScenariosByCohortId from '../services/getAvailableScenariosByCohortId.js';

const db = setupMongo();

const userId = new mongoose.Types.ObjectId();
const cohortId = new mongoose.Types.ObjectId();

const user = () => ({ _id: userId });

const ownedPublished = (overrides = {}) => db.models.Scenario.create({
  name: 'Scenario',
  isPublished: true,
  collaborators: [{ user: userId, role: 'OWNER' }],
  ...overrides
});

describe('getAvailableScenariosByCohortId (in-memory mongo)', () => {
  beforeEach(() => {});

  it('only returns published scenarios the user owns that are not already in the cohort', async () => {
    const available = await ownedPublished({ name: 'Available' });

    // Excluded: already linked to the cohort.
    await ownedPublished({ name: 'AlreadyLinked', cohorts: [{ cohort: cohortId, sortOrder: 0 }] });
    // Excluded: not published.
    await ownedPublished({ name: 'Unpublished', isPublished: false });
    // Excluded: user is not a collaborator.
    await db.models.Scenario.create({ name: 'NotMine', isPublished: true, collaborators: [{ user: new mongoose.Types.ObjectId(), role: 'OWNER' }] });

    const { scenarios, count } = await getAvailableScenariosByCohortId(
      { cohortId: String(cohortId) }, {}, { models: db.models, user: user() }
    );

    expect(scenarios.map((s) => String(s._id))).toEqual([String(available._id)]);
    expect(count).toBe(1);
  });

  it('returns scenarios, count, currentPage, totalPages', async () => {
    await ownedPublished({ name: 'Available' });

    const result = await getAvailableScenariosByCohortId(
      { cohortId: String(cohortId) }, {}, { models: db.models, user: user() }
    );

    expect(result).toMatchObject({ count: 1, currentPage: 1, totalPages: 1 });
  });
});
