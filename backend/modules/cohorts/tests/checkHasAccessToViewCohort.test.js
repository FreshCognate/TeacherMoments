import { describe, it, expect, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';
import checkHasAccessToViewCohort from '../helpers/checkHasAccessToViewCohort.js';

const db = setupMongo();

describe('checkHasAccessToViewCohort (in-memory mongo)', () => {
  beforeEach(() => {});

  it('throws 401 when no cohortId is provided', async () => {
    await expect(
      checkHasAccessToViewCohort({}, { user: { _id: new mongoose.Types.ObjectId(), role: 'PARTICIPANT' }, models: db.models })
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('returns true when the user has the cohort in their cohorts array', async () => {
    const cohortId = new mongoose.Types.ObjectId();
    const user = await db.models.User.create({
      email: 'member@example.com',
      cohorts: [{ cohort: cohortId }]
    });

    const result = await checkHasAccessToViewCohort(
      { cohortId },
      { user: { _id: user._id, role: 'PARTICIPANT' }, models: db.models }
    );

    expect(result).toBe(true);
  });

  it('grants access for SUPER_ADMIN without any membership or collaborator', async () => {
    const result = await checkHasAccessToViewCohort(
      { cohortId: new mongoose.Types.ObjectId() },
      { user: { _id: new mongoose.Types.ObjectId(), role: 'SUPER_ADMIN' }, models: db.models }
    );
    expect(result).toBe(true);
  });

  it('grants access via collaborator role for ADMIN', async () => {
    const userId = new mongoose.Types.ObjectId();
    const cohort = await db.models.Cohort.create({
      name: 'C',
      collaborators: [{ user: userId, role: 'OWNER' }]
    });

    const result = await checkHasAccessToViewCohort(
      { cohortId: cohort._id },
      { user: { _id: userId, role: 'ADMIN' }, models: db.models }
    );
    expect(result).toBe(true);
  });

  it('grants access via collaborator role for FACILITATOR', async () => {
    const userId = new mongoose.Types.ObjectId();
    const cohort = await db.models.Cohort.create({
      name: 'C',
      collaborators: [{ user: userId, role: 'AUTHOR' }]
    });

    const result = await checkHasAccessToViewCohort(
      { cohortId: cohort._id },
      { user: { _id: userId, role: 'FACILITATOR' }, models: db.models }
    );
    expect(result).toBe(true);
  });

  it('throws 401 for a plain non-member user', async () => {
    await expect(
      checkHasAccessToViewCohort(
        { cohortId: new mongoose.Types.ObjectId() },
        { user: { _id: new mongoose.Types.ObjectId(), role: 'PARTICIPANT' }, models: db.models }
      )
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('throws 401 when an ADMIN is neither a member nor a collaborator', async () => {
    const cohort = await db.models.Cohort.create({ name: 'C' });
    await expect(
      checkHasAccessToViewCohort(
        { cohortId: cohort._id },
        { user: { _id: new mongoose.Types.ObjectId(), role: 'ADMIN' }, models: db.models }
      )
    ).rejects.toMatchObject({ statusCode: 401 });
  });
});
