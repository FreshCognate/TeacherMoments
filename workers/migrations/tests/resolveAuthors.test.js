import { describe, it, expect, vi, beforeEach } from 'vitest';
import resolveAuthors from '../helpers/resolveAuthors.js';

const buildPool = (responses) => {
  const query = vi.fn();
  for (const r of responses) query.mockResolvedValueOnce({ rows: r });
  return { query };
};

const buildModels = (mongoUsers) => ({
  User: { find: vi.fn().mockResolvedValue(mongoUsers) }
});

describe('resolveAuthors', () => {
  beforeEach(() => vi.clearAllMocks());

  it('falls back to fallbackUserId when there are no PG authors or collaborators', async () => {
    const pool = buildPool([
      [], // collaborators (no author_id, so the author lookup is skipped)
    ]);
    const models = buildModels([]);

    const result = await resolveAuthors({
      pgScenario: { id: 'sc1' },
      pool,
      models,
      fallbackUserId: 'fallback'
    });

    expect(result.createdBy).toBe('fallback');
    expect(result.collaborators).toEqual([{ user: 'fallback', role: 'OWNER' }]);
    expect(result.originalAuthorEmail).toBeNull();
    expect(result.matchedCount).toBe(1);
    expect(result.unmatchedCount).toBe(0);
  });

  it('looks up the author email when author_id is set and credits them as OWNER', async () => {
    const pool = buildPool([
      [{ email: 'owner@x.com' }], // author lookup
      [] // collaborators
    ]);
    const models = buildModels([{ email: 'owner@x.com', _id: 'u1' }]);

    const result = await resolveAuthors({
      pgScenario: { id: 'sc1', author_id: 'a1' },
      pool,
      models,
      fallbackUserId: 'fallback'
    });

    expect(result.originalAuthorEmail).toBe('owner@x.com');
    expect(result.createdBy).toBe('u1');
    expect(result.collaborators).toEqual([{ user: 'u1', role: 'OWNER' }]);
  });

  it('maps PG roles owner→OWNER and author→AUTHOR; ignores unknown roles', async () => {
    const pool = buildPool([
      [{ email: 'a@x.com' }], // author
      [
        { email: 'a@x.com', role: 'owner' },
        { email: 'b@x.com', role: 'author' },
        { email: 'c@x.com', role: 'reviewer' } // unknown role → dropped
      ]
    ]);
    const models = buildModels([
      { email: 'a@x.com', _id: 'u1' },
      { email: 'b@x.com', _id: 'u2' },
      { email: 'c@x.com', _id: 'u3' }
    ]);

    const result = await resolveAuthors({
      pgScenario: { id: 'sc1', author_id: 'a1' },
      pool,
      models,
      fallbackUserId: 'fallback'
    });

    expect(result.collaborators).toEqual([
      { user: 'u1', role: 'OWNER' },
      { user: 'u2', role: 'AUTHOR' }
    ]);
    expect(result.createdBy).toBe('u1');
  });

  it('falls back to fallback createdBy when the original author email has no Mongo match', async () => {
    const pool = buildPool([
      [{ email: 'orphan@x.com' }],
      [{ email: 'collab@x.com', role: 'author' }]
    ]);
    const models = buildModels([
      { email: 'collab@x.com', _id: 'u2' }
    ]);

    const result = await resolveAuthors({
      pgScenario: { id: 'sc1', author_id: 'a1' },
      pool,
      models,
      fallbackUserId: 'fallback'
    });

    expect(result.createdBy).toBe('fallback');
    expect(result.collaborators).toEqual([{ user: 'u2', role: 'AUTHOR' }]);
    expect(result.unmatchedCount).toBe(1); // orphan email
  });

  it('counts pgEmailCount, matchedCount and unmatchedCount', async () => {
    const pool = buildPool([
      [{ email: 'a@x.com' }],
      [
        { email: 'a@x.com', role: 'owner' },
        { email: 'b@x.com', role: 'author' },
        { email: 'c@x.com', role: 'author' }
      ]
    ]);
    const models = buildModels([
      { email: 'a@x.com', _id: 'u1' },
      { email: 'b@x.com', _id: 'u2' }
    ]);

    const result = await resolveAuthors({
      pgScenario: { id: 'sc1', author_id: 'a1' },
      pool,
      models,
      fallbackUserId: 'fallback'
    });

    expect(result.pgEmailCount).toBe(3);
    expect(result.matchedCount).toBe(2);
    expect(result.unmatchedCount).toBe(1);
  });
});
