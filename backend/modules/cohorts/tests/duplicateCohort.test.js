import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { checkAccessMock, generateInviteTokenMock } = vi.hoisted(() => ({
  checkAccessMock: vi.fn(),
  generateInviteTokenMock: vi.fn()
}));

vi.mock('../helpers/checkHasAccessToEditCohort.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));

vi.mock('../helpers/generateInviteToken.js', () => ({
  default: () => generateInviteTokenMock()
}));

import duplicateCohort from '../services/duplicateCohort.js';

const FIXED_NOW = new Date('2026-05-06T12:00:00Z');

const buildContext = ({ existingCohort, transactionFn = (cb) => cb('session-1'), createResult }) => {
  const create = vi.fn().mockResolvedValue(createResult || []);
  const connection = { transaction: vi.fn(transactionFn).mockReturnValue({ catch: vi.fn().mockResolvedValue() }) };
  return {
    models: {
      Cohort: {
        findById: vi.fn().mockResolvedValue(existingCohort),
        create
      }
    },
    user: { _id: 'u1' },
    connection
  };
};

describe('duplicateCohort', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
    vi.clearAllMocks();
    generateInviteTokenMock.mockReturnValue('new-token');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('throws 404 when the source cohort is not found', async () => {
    const ctx = buildContext({ existingCohort: null });
    await expect(duplicateCohort({ cohortId: 'missing' }, {}, ctx))
      .rejects.toMatchObject({ statusCode: 404 });
  });

  it('creates a duplicate with " - Duplicate" appended to the name and a fresh invite', async () => {
    const newCohort = { _id: 'new-cohort' };

    const transactionFn = async (cb) => {
      await cb('session-1');
      return { catch: vi.fn() };
    };

    const create = vi.fn().mockResolvedValue([newCohort]);
    const connection = {
      transaction: vi.fn((cb) => {
        const result = cb('session-1');
        return Promise.resolve(result).then(() => ({ catch: () => {} }));
      })
    };
    connection.transaction = vi.fn(async (cb) => {
      await cb('session-1');
    });
    connection.transaction.mockImplementation((cb) => {
      const promise = cb('session-1');
      return Object.assign(promise, { catch: () => promise });
    });

    const ctx = {
      models: {
        Cohort: {
          findById: vi.fn().mockResolvedValue({ _id: 'src', name: 'Original' }),
          create
        }
      },
      user: { _id: 'u1' },
      connection
    };

    const result = await duplicateCohort({ cohortId: 'src' }, {}, ctx);

    const [docs, options] = create.mock.calls[0];
    expect(docs[0]).toMatchObject({
      name: 'Original - Duplicate',
      originalCohort: 'src',
      createdBy: 'u1',
      createdAt: FIXED_NOW
    });
    expect(docs[0].invites[0]).toMatchObject({
      token: 'new-token',
      isActive: true,
      createdBy: 'u1'
    });
    expect(docs[0]._id).toBeUndefined();
    expect(options).toEqual({ session: 'session-1' });
    expect(result).toBe(newCohort);
  });
});
