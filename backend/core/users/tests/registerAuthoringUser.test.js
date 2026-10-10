import { describe, it, expect, beforeEach } from 'vitest';
import { setupMongo } from '../../../../tests/with-mongo.js';

import registerAuthoringUser from '../services/registerAuthoringUser.js';

const db = setupMongo();

describe('registerAuthoringUser (in-memory mongo)', () => {
  beforeEach(() => {});

  it('throws 400 when the email already exists', async () => {
    await db.models.User.create({ email: 'sam@example.com', role: 'ADMIN' });

    await expect(
      registerAuthoringUser({ email: 'sam@example.com', role: 'ADMIN' }, {}, { models: db.models })
    ).rejects.toMatchObject({ statusCode: 400, message: 'This user already exists.' });
  });

  it('creates the user with a lowercased email and the given role', async () => {
    const result = await registerAuthoringUser(
      { email: 'Sam@EXAMPLE.com', role: 'ADMIN' }, {}, { models: db.models }
    );

    const stored = await db.models.User.findById(result._id).lean();
    expect(stored.email).toBe('sam@example.com');
    expect(stored.role).toBe('ADMIN');
    expect(stored.createdAt).toBeInstanceOf(Date);
    expect(stored.registeredAt).toBeInstanceOf(Date);
    expect(stored.registrationId).toBeUndefined();
  });

  it('throws 401 when an admin tries to create a SUPER_ADMIN', async () => {
    await expect(
      registerAuthoringUser(
        { email: 'new@example.com', role: 'SUPER_ADMIN' }, {}, { models: db.models, user: { role: 'ADMIN' } }
      )
    ).rejects.toMatchObject({ statusCode: 401 });

    const stored = await db.models.User.findOne({ email: 'new@example.com' }).lean();
    expect(stored).toBeNull();
  });

  it('throws 401 when there is no calling user and the role is SUPER_ADMIN', async () => {
    await expect(
      registerAuthoringUser({ email: 'new@example.com', role: 'SUPER_ADMIN' }, {}, { models: db.models })
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('allows a super admin to create a SUPER_ADMIN', async () => {
    const result = await registerAuthoringUser(
      { email: 'new@example.com', role: 'SUPER_ADMIN' }, {}, { models: db.models, user: { role: 'SUPER_ADMIN' } }
    );

    const stored = await db.models.User.findById(result._id).lean();
    expect(stored.role).toBe('SUPER_ADMIN');
  });

  it('returns the created user', async () => {
    const result = await registerAuthoringUser(
      { email: 'new@example.com', role: 'ADMIN' }, {}, { models: db.models }
    );
    expect(result._id).toBeDefined();
    expect(result.email).toBe('new@example.com');
  });
});
