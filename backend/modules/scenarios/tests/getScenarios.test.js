import { describe, it, expect, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';
import getScenarios from '../services/getScenarios.js';

const db = setupMongo();

const userId = new mongoose.Types.ObjectId();

const ownedScenario = (overrides = {}) => db.models.Scenario.create({
  name: 'Scenario',
  collaborators: [{ user: userId, role: 'OWNER' }],
  ...overrides
});

const user = (extra = {}) => ({ _id: userId, ...extra });

describe('getScenarios (in-memory mongo)', () => {
  beforeEach(() => {});

  it('excludes deleted scenarios by default', async () => {
    const active = await ownedScenario({ name: 'Active' });
    await ownedScenario({ name: 'Deleted', isDeleted: true });

    const { scenarios, count } = await getScenarios({}, {}, { models: db.models, user: user() });
    expect(scenarios.map((s) => String(s._id))).toEqual([String(active._id)]);
    expect(count).toBe(1);
  });

  it('filters by name when searchValue is set', async () => {
    const spring = await ownedScenario({ name: 'Spring' });
    await ownedScenario({ name: 'Autumn' });

    const { scenarios } = await getScenarios({}, { searchValue: 'spring' }, { models: db.models, user: user() });
    expect(scenarios.map((s) => String(s._id))).toEqual([String(spring._id)]);
  });

  it('only returns scenarios the non-super-admin collaborates on', async () => {
    const mine = await ownedScenario({ name: 'Mine' });
    await db.models.Scenario.create({ name: 'Theirs', collaborators: [{ user: new mongoose.Types.ObjectId(), role: 'OWNER' }] });

    const { scenarios } = await getScenarios({}, {}, { models: db.models, user: user() });
    expect(scenarios.map((s) => String(s._id))).toEqual([String(mine._id)]);
  });

  it('returns all scenarios for SUPER_ADMIN regardless of collaboration', async () => {
    const a = await db.models.Scenario.create({ name: 'A' });
    const b = await db.models.Scenario.create({ name: 'B' });

    const { scenarios, count } = await getScenarios({}, {}, { models: db.models, user: user({ role: 'SUPER_ADMIN' }) });
    const ids = scenarios.map((s) => String(s._id));
    expect(ids).toEqual(expect.arrayContaining([String(a._id), String(b._id)]));
    expect(count).toBe(2);
  });

  it('filters by accessType when provided', async () => {
    const pub = await ownedScenario({ name: 'Public', accessType: 'PUBLIC' });
    await ownedScenario({ name: 'Private', accessType: 'PRIVATE' });

    const { scenarios } = await getScenarios({ accessType: 'PUBLIC' }, {}, { models: db.models, user: user() });
    expect(scenarios.map((s) => String(s._id))).toEqual([String(pub._id)]);
  });

  it('sorts by name by default', async () => {
    await db.models.Scenario.create({ name: 'Bravo' });
    await db.models.Scenario.create({ name: 'Alpha' });

    const { scenarios } = await getScenarios({}, {}, { models: db.models, user: user({ role: 'SUPER_ADMIN' }) });
    expect(scenarios.map((s) => s.name)).toEqual(['Alpha', 'Bravo']);
  });

  it('returns count, currentPage and totalPages', async () => {
    await ownedScenario({ name: 'Mine' });
    const result = await getScenarios({}, {}, { models: db.models, user: user() });
    expect(result).toMatchObject({ count: 1, currentPage: 1, totalPages: 1 });
  });
});
