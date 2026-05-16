import { describe, it, expect, vi, beforeEach } from 'vitest';

const { generateRandomUsernameMock } = vi.hoisted(() => ({
  generateRandomUsernameMock: vi.fn()
}));

vi.mock('#core/users/helpers/generateRandomUsername.js', () => ({
  default: (...args) => generateRandomUsernameMock(...args)
}));

import controller from '../generateUsername.controller.js';

describe('generateUsername.controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generates a username from the User model and returns it', async () => {
    generateRandomUsernameMock.mockResolvedValue('happy-otter-92');

    const result = await controller.all({}, { models: { User: { model: 'User' } } });

    expect(generateRandomUsernameMock).toHaveBeenCalledWith({ model: 'User' });
    expect(result).toEqual({ username: 'happy-otter-92' });
  });
});
