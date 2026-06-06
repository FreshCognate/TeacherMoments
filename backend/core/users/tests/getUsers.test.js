import { describe, it, expect, beforeEach } from 'vitest';
import { setupMongo } from '../../../../tests/with-mongo.js';
import getUsers from '../services/getUsers.js';

const db = setupMongo();

describe('getUsers (in-memory mongo)', () => {
  beforeEach(() => {});

  it('excludes deleted users by default and honours an explicit isDeleted', async () => {
    await db.models.User.create({ email: 'active@x.com', lastName: 'Active', role: 'ADMIN' });
    await db.models.User.create({ email: 'gone@x.com', lastName: 'Gone', role: 'ADMIN', isDeleted: true });

    const active = await getUsers({}, {}, { models: db.models, user: { role: 'ADMIN' } });
    expect(active.users.map((u) => u.email)).toEqual(['active@x.com']);

    const deleted = await getUsers({}, { isDeleted: true }, { models: db.models, user: { role: 'ADMIN' } });
    expect(deleted.users.map((u) => u.email)).toEqual(['gone@x.com']);
  });

  it('excludes SUPER_ADMIN users for non-super-admin callers but includes them for SUPER_ADMIN', async () => {
    await db.models.User.create({ email: 'super@x.com', lastName: 'Super', role: 'SUPER_ADMIN' });
    await db.models.User.create({ email: 'admin@x.com', lastName: 'Admin', role: 'ADMIN' });

    const asAdmin = await getUsers({}, {}, { models: db.models, user: { role: 'ADMIN' } });
    expect(asAdmin.users.map((u) => u.email)).toEqual(['admin@x.com']);

    const asSuper = await getUsers({}, {}, { models: db.models, user: { role: 'SUPER_ADMIN' } });
    expect(asSuper.users.map((u) => u.email).sort()).toEqual(['admin@x.com', 'super@x.com']);
  });

  it('searches across firstName/lastName/email when searchValue is provided', async () => {
    await db.models.User.create({ email: 'sam@x.com', firstName: 'Sam', lastName: 'Smith', role: 'ADMIN' });
    await db.models.User.create({ email: 'jo@x.com', firstName: 'Jo', lastName: 'Jones', role: 'ADMIN' });

    const result = await getUsers({}, { searchValue: 'sam' }, { models: db.models, user: { role: 'ADMIN' } });
    expect(result.users.map((u) => u.email)).toEqual(['sam@x.com']);
  });

  it('returns users, count, currentPage and totalPages and parses currentPage', async () => {
    await db.models.User.create({ email: 'a@x.com', lastName: 'A', role: 'ADMIN' });
    const result = await getUsers({}, { currentPage: '1' }, { models: db.models, user: { role: 'ADMIN' } });
    expect(result).toMatchObject({ count: 1, currentPage: 1, totalPages: 1 });
  });
});
