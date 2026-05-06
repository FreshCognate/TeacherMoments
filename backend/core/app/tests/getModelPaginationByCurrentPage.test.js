import { describe, it, expect } from 'vitest';
import getModelPaginationByCurrentPage from '../helpers/getModelPaginationByCurrentPage.js';

describe('getModelPaginationByCurrentPage', () => {
  it('uses the default page size of 20 when none is provided', () => {
    const options = {};
    getModelPaginationByCurrentPage(1, options);
    expect(options).toEqual({ skip: 0, limit: 20 });
  });

  it('skips the previous pages worth of records', () => {
    const options = {};
    getModelPaginationByCurrentPage(3, options);
    expect(options.skip).toBe(40);
    expect(options.limit).toBe(20);
  });

  it('respects a custom pagination amount', () => {
    const options = {};
    getModelPaginationByCurrentPage(2, options, 50);
    expect(options).toEqual({ skip: 50, limit: 50 });
  });

  it('preserves any existing options not related to pagination', () => {
    const options = { sort: '-createdAt' };
    getModelPaginationByCurrentPage(1, options, 10);
    expect(options).toEqual({ sort: '-createdAt', skip: 0, limit: 10 });
  });
});
