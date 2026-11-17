import { describe, it, expect } from 'vitest';
import Joi from 'joi';
import routes from '../cohorts.routes.js';

const createBody = Joi.object(routes.find((route) => route.route === '/cohorts').create.body);

describe('cohorts routes', () => {
  it('asks for a name when a cohort is created without one', () => {
    expect(createBody.validate({ name: '' }).error.message).toBe('Give the cohort a name.');
  });

  it('accepts a named cohort, and a duplicate that names only its source', () => {
    expect(createBody.validate({ name: 'Fall Semester' }).error).toBeUndefined();
    expect(createBody.validate({ cohortId: 'cohort-1' }).error).toBeUndefined();
  });
});
