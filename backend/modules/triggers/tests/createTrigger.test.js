import { describe, it, expect, vi, beforeEach } from 'vitest';

const { checkAccessMock, setHasChangesMock } = vi.hoisted(() => ({
  checkAccessMock: vi.fn(),
  setHasChangesMock: vi.fn()
}));

vi.mock('../../scenarios/helpers/checkHasAccessToScenario.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));
vi.mock('../../scenarios/services/setScenarioHasChanges.js', () => ({
  default: (...args) => setHasChangesMock(...args)
}));

import createTrigger from '../services/createTrigger.js';

describe('createTrigger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
  });

  it('assigns sortOrder = count of existing same-type/elementRef triggers and creates the trigger', async () => {
    const find = vi.fn().mockResolvedValue([{ _id: 'existing1' }, { _id: 'existing2' }]);
    const create = vi.fn().mockResolvedValue({ _id: 'new1' });

    const context = { models: { Trigger: { find, create } }, user: { _id: 'u1' } };

    const result = await createTrigger(
      { scenario: 's1', triggerType: 'BLOCK', elementRef: 'b1', action: 'SHOW_FEEDBACK_FROM_PROMPTS' },
      {},
      context
    );

    expect(checkAccessMock).toHaveBeenCalledWith({ modelId: 's1', modelType: 'Scenario' }, context);
    expect(find).toHaveBeenCalledWith({
      scenario: 's1',
      triggerType: 'BLOCK',
      elementRef: 'b1',
      isDeleted: false
    });
    expect(create).toHaveBeenCalledWith({
      scenario: 's1',
      triggerType: 'BLOCK',
      elementRef: 'b1',
      action: 'SHOW_FEEDBACK_FROM_PROMPTS',
      sortOrder: 2,
      createdBy: 'u1'
    });
    expect(setHasChangesMock).toHaveBeenCalledWith({ scenarioId: 's1' }, {}, context);
    expect(result).toEqual({ _id: 'new1' });
  });

  it('assigns sortOrder=0 when there are no existing siblings', async () => {
    const find = vi.fn().mockResolvedValue([]);
    const create = vi.fn().mockResolvedValue({ _id: 'new1' });

    await createTrigger(
      { scenario: 's1', triggerType: 'BLOCK', elementRef: 'b1', action: 'X' },
      {},
      { models: { Trigger: { find, create } }, user: { _id: 'u1' } }
    );

    expect(create).toHaveBeenCalledWith(expect.objectContaining({ sortOrder: 0 }));
  });
});
