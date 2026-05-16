import { describe, it, expect, vi, beforeEach } from 'vitest';

const { createSlideMock, createStemMock } = vi.hoisted(() => ({
  createSlideMock: vi.fn(),
  createStemMock: vi.fn()
}));

vi.mock('../../slides/services/createSlide.js', () => ({ default: (...args) => createSlideMock(...args) }));
vi.mock('../../stems/services/createStem.js', () => ({ default: (...args) => createStemMock(...args) }));

import createScenario from '../services/createScenario.js';

describe('createScenario', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createStemMock.mockResolvedValue({ ref: 'stem-ref' });
    createSlideMock.mockResolvedValue({});
  });

  it('throws 400 when no name is given', async () => {
    await expect(createScenario({}, {}, { user: { _id: 'u1' }, models: {} }))
      .rejects.toMatchObject({ statusCode: 400, message: 'A scenario must have a name' });
  });

  it('creates a scenario with the user as OWNER', async () => {
    const create = vi.fn().mockResolvedValue({ _id: 's1' });

    await createScenario(
      { name: 'My Scenario', accessType: 'PRIVATE' },
      {},
      { user: { _id: 'u1' }, models: { Scenario: { create } } }
    );

    expect(create).toHaveBeenCalledWith({
      name: 'My Scenario',
      accessType: 'PRIVATE',
      createdBy: 'u1',
      collaborators: [{ user: 'u1', role: 'OWNER' }]
    });
  });

  it('creates an initial root stem and a slide referencing it', async () => {
    const create = vi.fn().mockResolvedValue({ _id: 's1' });
    const ctx = { user: { _id: 'u1' }, models: { Scenario: { create } } };

    await createScenario({ name: 'My Scenario' }, {}, ctx);

    expect(createStemMock).toHaveBeenCalledWith({ scenario: 's1', name: 'Stem 1', isRoot: true }, {}, ctx);
    expect(createSlideMock).toHaveBeenCalledWith({ scenario: 's1', sortOrder: 0, stemRef: 'stem-ref' }, {}, ctx);
  });

  it('returns the created scenario', async () => {
    const scenario = { _id: 's1' };
    const create = vi.fn().mockResolvedValue(scenario);

    const result = await createScenario(
      { name: 'My Scenario' },
      {},
      { user: { _id: 'u1' }, models: { Scenario: { create } } }
    );

    expect(result).toBe(scenario);
  });
});
