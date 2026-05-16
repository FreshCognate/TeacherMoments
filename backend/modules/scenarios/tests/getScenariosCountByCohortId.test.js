import { describe, it, expect, vi } from 'vitest';
import getScenariosCountByCohortId from '../services/getScenariosCountByCohortId.js';

describe('getScenariosCountByCohortId', () => {
  it('counts non-deleted scenarios in the cohort', async () => {
    const countDocuments = vi.fn().mockResolvedValue(5);

    const result = await getScenariosCountByCohortId(
      { cohortId: 'c1' },
      {},
      { models: { Scenario: { countDocuments } }, user: {} }
    );

    expect(countDocuments).toHaveBeenCalledWith({ isDeleted: false, 'cohorts.cohort': 'c1' });
    expect(result).toEqual({ count: 5 });
  });
});
