import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setupMongo } from '../../../../tests/with-mongo.js';

const { uuidV4Mock } = vi.hoisted(() => ({ uuidV4Mock: vi.fn() }));

vi.mock('node-uuid', () => ({ default: { v4: () => uuidV4Mock() } }));

import registerAuthoringUser from '../services/registerAuthoringUser.js';

const db = setupMongo();

describe('registerAuthoringUser (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    uuidV4Mock.mockReturnValue('uuid-1234');
  });

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
  });

  it('returns the created user', async () => {
    const result = await registerAuthoringUser(
      { email: 'new@example.com', role: 'ADMIN' }, {}, { models: db.models }
    );
    expect(result._id).toBeDefined();
    expect(result.email).toBe('new@example.com');
  });
});
