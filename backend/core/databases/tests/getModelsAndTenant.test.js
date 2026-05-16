import { describe, it, expect, beforeEach } from 'vitest';
import connections from '../connections.js';
import getModelsAndTenant from '../helpers/getModelsAndTenant.js';

describe('getModelsAndTenant', () => {
  const fakeModels = { User: {}, Scenario: {} };

  beforeEach(() => {
    Object.keys(connections).forEach((key) => delete connections[key]);
    connections.app = { connection: { models: fakeModels } };
  });

  it('returns the models from the app connection', async () => {
    const { models } = await getModelsAndTenant({});
    expect(models).toBe(fakeModels);
  });

  it('returns the user _id as the tenant when a user is on the request', async () => {
    const { tenant } = await getModelsAndTenant({ user: { _id: 'user-1' } });
    expect(tenant).toBe('user-1');
  });

  it('returns an undefined tenant when there is no user on the request', async () => {
    const { tenant } = await getModelsAndTenant({});
    expect(tenant).toBeUndefined();
  });
});
