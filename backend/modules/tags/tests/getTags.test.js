import { describe, it, expect, beforeEach } from 'vitest';
import { setupMongo } from '../../../../tests/with-mongo.js';
import getTags from '../services/getTags.js';

const db = setupMongo();

const createTag = (overrides = {}) => db.models.Tag.create({ name: 'tag', tagType: 'TOPIC', ...overrides });

describe('getTags (in-memory mongo)', () => {
  beforeEach(() => {});

  it('excludes deleted tags by default and honours an explicit isDeleted', async () => {
    await createTag({ name: 'active' });
    await createTag({ name: 'gone', isDeleted: true });

    const active = await getTags({}, {}, { models: db.models });
    expect(active.tags.map((t) => t.name)).toEqual(['active']);

    const deleted = await getTags({}, { isDeleted: true }, { models: db.models });
    expect(deleted.tags.map((t) => t.name)).toEqual(['gone']);
  });

  it('builds a name search when searchValue is set', async () => {
    await createTag({ name: 'foobar' });
    await createTag({ name: 'baz' });

    const result = await getTags({}, { searchValue: 'foo' }, { models: db.models });
    expect(result.tags.map((t) => t.name)).toEqual(['foobar']);
  });

  it('filters by tagType when supplied', async () => {
    await createTag({ name: 'cat', tagType: 'CATEGORY' });
    await createTag({ name: 'top', tagType: 'TOPIC' });

    const result = await getTags({ tagType: 'CATEGORY' }, {}, { models: db.models });
    expect(result.tags.map((t) => t.name)).toEqual(['cat']);
  });

  it('returns tags, count, currentPage and totalPages', async () => {
    await createTag({ name: 'only' });
    const result = await getTags({}, {}, { models: db.models });
    expect(result).toMatchObject({ count: 1, currentPage: 1, totalPages: 1 });
  });
});
