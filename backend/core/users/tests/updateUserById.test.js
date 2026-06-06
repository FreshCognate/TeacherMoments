import { describe, it, expect, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';
import updateUserById from '../services/updateUserById.js';

const db = setupMongo();

describe('updateUserById (in-memory mongo)', () => {
  beforeEach(() => {});

  it('throws 401 when a non-admin tries to update another user', async () => {
    await expect(
      updateUserById(
        { userId: String(new mongoose.Types.ObjectId()), update: { firstName: 'Sam' } },
        {},
        { user: { _id: String(new mongoose.Types.ObjectId()), role: 'USER' }, models: db.models }
      )
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('allows a non-admin to update themselves', async () => {
    const self = await db.models.User.create({ email: 'self@x.com', firstName: 'Old' });
    const selfId = String(self._id);

    const result = await updateUserById(
      { userId: selfId, update: { firstName: 'Sam' } },
      {},
      { user: { _id: selfId, role: 'USER' }, models: db.models }
    );

    expect(result.firstName).toBe('Sam');
  });

  it('lowercases an email when set in the update', async () => {
    const target = await db.models.User.create({ email: 'target@x.com' });

    await updateUserById(
      { userId: target._id, update: { email: 'Sam@EXAMPLE.com' } },
      {},
      { user: { _id: new mongoose.Types.ObjectId(), role: 'ADMIN' }, models: db.models }
    );

    const stored = await db.models.User.findById(target._id).lean();
    expect(stored.email).toBe('sam@example.com');
  });

  it('throws 400 when another user already owns the email', async () => {
    await db.models.User.create({ email: 'taken@example.com' });
    const target = await db.models.User.create({ email: 'target@x.com' });

    await expect(
      updateUserById(
        { userId: target._id, update: { email: 'taken@example.com' } },
        {},
        { user: { _id: new mongoose.Types.ObjectId(), role: 'ADMIN' }, models: db.models }
      )
    ).rejects.toMatchObject({ statusCode: 400, message: 'A user with this email already exists.' });
  });

  it('stamps updatedAt on the update', async () => {
    const target = await db.models.User.create({ email: 'target@x.com' });

    await updateUserById(
      { userId: target._id, update: { firstName: 'Sam' } },
      {},
      { user: { _id: new mongoose.Types.ObjectId(), role: 'ADMIN' }, models: db.models }
    );

    const stored = await db.models.User.findById(target._id).lean();
    expect(stored.updatedAt).toBeInstanceOf(Date);
  });
});
