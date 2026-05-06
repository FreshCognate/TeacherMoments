import { describe, it, expect, beforeEach } from 'vitest';
import { MODELS } from '../helpers/registerModel.js';
import getRegisteredModels from '../helpers/getRegisteredModels.js';

describe('getRegisteredModels', () => {
  beforeEach(() => {
    MODELS.length = 0;
  });

  it('returns an empty array when no models are registered for the type', () => {
    expect(getRegisteredModels('app')).toEqual([]);
  });

  it('returns models whose type matches', () => {
    MODELS.push(
      { name: 'User', type: 'app', collection: 'users', model: {} },
      { name: 'Job', type: 'workers', collection: 'jobs', model: {} },
      { name: 'Scenario', type: 'app', collection: 'scenarios', model: {} }
    );

    const result = getRegisteredModels('app');
    expect(result.map((m) => m.name)).toEqual(['User', 'Scenario']);
  });

  it('does not modify the underlying MODELS array', () => {
    MODELS.push(
      { name: 'User', type: 'app', collection: 'users', model: {} },
      { name: 'Job', type: 'workers', collection: 'jobs', model: {} }
    );

    getRegisteredModels('app');

    expect(MODELS).toHaveLength(2);
  });
});
