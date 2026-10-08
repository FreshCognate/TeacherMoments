import { describe, it, expect } from 'vitest';
import Joi from 'joi';
import routes from '../users.routes.js';

const usersRoute = routes[0];
const createSchema = Joi.object(usersRoute.create.body);
const updateSchema = Joi.object(usersRoute.update.body);

describe('users.routes validation', () => {
  it('rejects SUPER_ADMIN as a role on create', () => {
    const { error } = createSchema.validate({ emails: ['a@b.com'], role: 'SUPER_ADMIN' });
    expect(error).toBeDefined();
  });

  it('rejects an arbitrary string as a role on create', () => {
    const { error } = createSchema.validate({ emails: ['a@b.com'], role: 'ANYTHING' });
    expect(error).toBeDefined();
  });

  it('accepts a listed role on create', () => {
    const { error } = createSchema.validate({ emails: ['a@b.com'], role: 'FACILITATOR' });
    expect(error).toBeUndefined();
  });

  it('rejects SUPER_ADMIN as a role on update', () => {
    const { error } = updateSchema.validate({ role: 'SUPER_ADMIN' });
    expect(error).toBeDefined();
  });

  it('accepts a listed role on update', () => {
    const { error } = updateSchema.validate({ role: 'ADMIN' });
    expect(error).toBeUndefined();
  });

  it('rejects an unknown selectedLanguage on update', () => {
    const { error } = updateSchema.validate({ selectedLanguage: 'xx-XX' });
    expect(error).toBeDefined();
  });
});
