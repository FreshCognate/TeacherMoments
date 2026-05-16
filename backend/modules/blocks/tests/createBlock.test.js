import { describe, it, expect, vi, beforeEach } from 'vitest';

const { checkAccessMock, setScenarioHasChangesMock } = vi.hoisted(() => ({
  checkAccessMock: vi.fn(),
  setScenarioHasChangesMock: vi.fn()
}));

vi.mock('../../scenarios/helpers/checkHasAccessToScenario.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));

vi.mock('../../scenarios/services/setScenarioHasChanges.js', () => ({
  default: (...args) => setScenarioHasChangesMock(...args)
}));

import createBlock from '../services/createBlock.js';

const buildModels = (existingBlocks = [], created = { _id: 'new-block' }) => ({
  Block: {
    find: vi.fn().mockResolvedValue(existingBlocks),
    create: vi.fn().mockResolvedValue(created)
  }
});

const buildContext = (modelsOverride = {}) => ({
  user: { _id: 'user-1' },
  models: { ...buildModels(), ...modelsOverride }
});

describe('createBlock', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('checks scenario access before creating', async () => {
    const ctx = buildContext();
    await createBlock({ scenario: 's1', slideRef: 'slide-1', blockType: 'TEXT' }, {}, ctx);

    expect(checkAccessMock).toHaveBeenCalledWith({ modelId: 's1', modelType: 'Scenario' }, ctx);
  });

  it('finds existing non-deleted blocks for the slide', async () => {
    const models = buildModels([{ _id: 'b1' }]);
    const ctx = { user: { _id: 'user-1' }, models };

    await createBlock({ scenario: 's1', slideRef: 'slide-1', blockType: 'TEXT' }, {}, ctx);

    expect(models.Block.find).toHaveBeenCalledWith({ scenario: 's1', slideRef: 'slide-1', isDeleted: false });
  });

  it('uses the existing block count as the new sortOrder', async () => {
    const models = buildModels([{ _id: 'b1' }, { _id: 'b2' }]);
    const ctx = { user: { _id: 'user-1' }, models };

    await createBlock({ scenario: 's1', slideRef: 'slide-1', blockType: 'TEXT' }, {}, ctx);

    expect(models.Block.create).toHaveBeenCalledWith(expect.objectContaining({
      sortOrder: 2,
      scenario: 's1',
      slideRef: 'slide-1',
      blockType: 'TEXT',
      createdBy: 'user-1'
    }));
  });

  it('marks the scenario as having changes', async () => {
    const ctx = buildContext();
    await createBlock({ scenario: 's1', slideRef: 'slide-1', blockType: 'TEXT' }, {}, ctx);

    expect(setScenarioHasChangesMock).toHaveBeenCalledWith({ scenarioId: 's1' }, {}, ctx);
  });

  it('returns the created block', async () => {
    const created = { _id: 'new-block', scenario: 's1' };
    const models = buildModels([], created);
    const ctx = { user: { _id: 'user-1' }, models };

    const result = await createBlock({ scenario: 's1', slideRef: 'slide-1', blockType: 'TEXT' }, {}, ctx);
    expect(result).toBe(created);
  });
});
