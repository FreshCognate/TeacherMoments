import { describe, it, expect, vi, beforeEach } from 'vitest';
import Joi from 'joi';
import handleValidation from '../helpers/handleValidation.js';

const buildResponse = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe('handleValidation', () => {
  let consoleLogSpy;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('calls next when shouldSkipValidation is true', () => {
    const next = vi.fn();
    const middleware = handleValidation(null, null, null, null, true);
    middleware({ body: { invalid: true } }, buildResponse(), next);
    expect(next).toHaveBeenCalled();
  });

  it('calls next when no validations are configured', () => {
    const next = vi.fn();
    const middleware = handleValidation(null, null, null, null, false);
    middleware({ body: {}, query: {}, files: {} }, buildResponse(), next);
    expect(next).toHaveBeenCalled();
  });

  it('passes a valid body validation through', () => {
    const next = vi.fn();
    const bodyValidation = Joi.object({ name: Joi.string().required() });
    const middleware = handleValidation(null, bodyValidation, null, null, false);

    middleware({ body: { name: 'Sam' } }, buildResponse(), next);
    expect(next).toHaveBeenCalled();
  });

  it('returns 400 with the Joi error message when body validation fails', () => {
    const next = vi.fn();
    const res = buildResponse();
    const bodyValidation = Joi.object({ name: Joi.string().required() });
    const middleware = handleValidation(null, bodyValidation, null, null, false);

    middleware({ body: {} }, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: expect.stringContaining('name') });
  });

  it('returns 400 when query validation fails', () => {
    const next = vi.fn();
    const res = buildResponse();
    const queryValidation = Joi.object({ page: Joi.number().required() });
    const middleware = handleValidation(null, null, queryValidation, null, false);

    middleware({ query: {} }, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 400 when files validation fails', () => {
    const next = vi.fn();
    const res = buildResponse();
    const filesValidation = Joi.object({ upload: Joi.any().required() });
    const middleware = handleValidation(null, null, null, filesValidation, false);

    middleware({ files: {} }, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('passes through TURNSTILE_ENABLED as a Joi context value when validating the body', () => {
    process.env.TURNSTILE_ENABLED = 'true';
    const next = vi.fn();
    const bodyValidation = Joi.object({
      token: Joi.when('$TURNSTILE_ENABLED', {
        is: 'true',
        then: Joi.string().required(),
        otherwise: Joi.string().optional()
      })
    });
    const middleware = handleValidation(null, bodyValidation, null, null, false);
    const res = buildResponse();

    middleware({ body: {} }, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);

    delete process.env.TURNSTILE_ENABLED;
  });
});
