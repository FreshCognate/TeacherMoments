import { describe, it, expect, vi, beforeEach } from 'vitest';

const { getModelsAndTenantMock } = vi.hoisted(() => ({
  getModelsAndTenantMock: vi.fn()
}));

vi.mock('#core/databases/helpers/getModelsAndTenant.js', () => ({
  default: (...args) => getModelsAndTenantMock(...args)
}));

import initialise from '../initialise.js';

const buildPassport = () => {
  let serializeFn = null;
  let deserializeFn = null;
  return {
    serializeUser: (fn) => { serializeFn = fn; },
    deserializeUser: (fn) => { deserializeFn = fn; },
    getSerializeFn: () => serializeFn,
    getDeserializeFn: () => deserializeFn
  };
};

describe('passport initialise', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('serializeUser', () => {
    it('serialises the user to their _id', () => {
      const passport = buildPassport();
      initialise(passport);

      const done = vi.fn();
      passport.getSerializeFn()({ _id: 'user-1', name: 'Sam' }, done);
      expect(done).toHaveBeenCalledWith(null, 'user-1');
    });
  });

  describe('deserializeUser', () => {
    it('looks up the user from models.User and returns them without otpCode', async () => {
      const userDoc = {
        _id: 'user-1',
        email: 'sam@example.com',
        otpCode: 'should-be-stripped',
        toObject: () => ({ _id: 'user-1', email: 'sam@example.com', otpCode: 'should-be-stripped' })
      };
      const findById = vi.fn().mockResolvedValue(userDoc);
      getModelsAndTenantMock.mockResolvedValue({ models: { User: { findById } } });

      const passport = buildPassport();
      initialise(passport);

      const done = vi.fn();
      passport.getDeserializeFn()({ session: 'data' }, 'user-1', done);

      await new Promise((r) => setImmediate(r));

      expect(findById).toHaveBeenCalledWith('user-1');
      expect(done).toHaveBeenCalledWith(null, expect.objectContaining({
        _id: 'user-1',
        email: 'sam@example.com'
      }));
      expect(done.mock.calls[0][1].otpCode).toBeUndefined();
    });

    it('calls done with "No user" when no user is found', async () => {
      const findById = vi.fn().mockResolvedValue(null);
      getModelsAndTenantMock.mockResolvedValue({ models: { User: { findById } } });

      const passport = buildPassport();
      initialise(passport);

      const done = vi.fn();
      passport.getDeserializeFn()({}, 'missing-user', done);

      await new Promise((r) => setImmediate(r));

      expect(done).toHaveBeenCalledWith('No user');
    });

    it('calls done with the error when findById throws', async () => {
      const error = new Error('db down');
      const findById = vi.fn().mockRejectedValue(error);
      getModelsAndTenantMock.mockResolvedValue({ models: { User: { findById } } });

      const passport = buildPassport();
      initialise(passport);

      const done = vi.fn();
      passport.getDeserializeFn()({}, 'user-1', done);

      await new Promise((r) => setImmediate(r));

      expect(done).toHaveBeenCalledWith(error);
    });

    it('forwards the request when fetching models', async () => {
      const userDoc = { _id: 'user-1', toObject: () => ({ _id: 'user-1' }) };
      const findById = vi.fn().mockResolvedValue(userDoc);
      getModelsAndTenantMock.mockResolvedValue({ models: { User: { findById } } });

      const passport = buildPassport();
      initialise(passport);

      const req = { user: { tenant: 'a' } };
      passport.getDeserializeFn()(req, 'user-1', vi.fn());

      await new Promise((r) => setImmediate(r));
      expect(getModelsAndTenantMock).toHaveBeenCalledWith(req);
    });
  });
});
