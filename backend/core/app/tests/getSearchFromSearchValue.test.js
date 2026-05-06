import { describe, it, expect } from 'vitest';
import getSearchFromSearchValue from '../helpers/getSearchFromSearchValue.js';

describe('getSearchFromSearchValue', () => {
  it('does nothing when searchValue is falsy', () => {
    const search = { existing: 'value' };
    getSearchFromSearchValue('', ['name'], search);
    expect(search).toEqual({ existing: 'value' });
  });

  it('does nothing when searchValue is undefined', () => {
    const search = {};
    getSearchFromSearchValue(undefined, ['name'], search);
    expect(search).toEqual({});
  });

  it('builds a case-insensitive regex $or query for each field', () => {
    const search = {};
    getSearchFromSearchValue('hello', ['name', 'email'], search);
    expect(search.$or).toEqual([
      { name: { $regex: 'hello', $options: 'i' } },
      { email: { $regex: 'hello', $options: 'i' } }
    ]);
  });

  it('preserves existing search keys while adding the $or query', () => {
    const search = { isActive: true };
    getSearchFromSearchValue('foo', ['title'], search);
    expect(search.isActive).toBe(true);
    expect(search.$or).toHaveLength(1);
  });
});
