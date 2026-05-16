import { describe, it, expect, beforeEach } from 'vitest';
import { registerModel, MODELS } from '../helpers/registerModel.js';

describe('registerModel', () => {
  beforeEach(() => {
    MODELS.length = 0;
  });

  it('pushes a model entry into the MODELS registry', () => {
    registerModel({ name: 'User', model: { schema: 'user' }, type: 'app', collection: 'users' });

    expect(MODELS).toHaveLength(1);
    expect(MODELS[0]).toEqual({
      name: 'User',
      model: { schema: 'user' },
      type: 'app',
      collection: 'users'
    });
  });

  it('appends multiple registrations in order', () => {
    registerModel({ name: 'A', model: {}, type: 'app', collection: 'a' });
    registerModel({ name: 'B', model: {}, type: 'app', collection: 'b' });
    registerModel({ name: 'C', model: {}, type: 'app', collection: 'c' });

    expect(MODELS.map((m) => m.name)).toEqual(['A', 'B', 'C']);
  });
});
