import { describe, it, expect, vi } from 'vitest';
import checkHasAccessToScenario from '../helpers/checkHasAccessToScenario.js';

describe('checkHasAccessToScenario', () => {
  it.each([
    ['Slide', 'Slide'],
    ['Block', 'Block'],
    ['Trigger', 'Trigger'],
    ['Stem', 'Stem']
  ])('resolves the scenario id from a %s model', async (modelType, modelName) => {
    const findById = vi.fn().mockResolvedValue({ scenario: 's1' });
    const Scenario = { findOne: vi.fn().mockResolvedValue({ _id: 's1' }) };
    const ctx = { user: { _id: 'u1' }, models: { [modelName]: { findById }, Scenario } };

    await checkHasAccessToScenario({ modelId: 'm1', modelType }, ctx);

    expect(findById).toHaveBeenCalledWith('m1', 'scenario');
  });

  it('uses the modelId directly when modelType is Scenario', async () => {
    const findOne = vi.fn().mockResolvedValue({ _id: 's1' });

    await checkHasAccessToScenario(
      { modelId: 's1', modelType: 'Scenario' },
      { user: { _id: 'u1' }, models: { Scenario: { findOne } } }
    );

    expect(findOne).toHaveBeenCalledWith({
      _id: 's1',
      collaborators: {
        $elemMatch: {
          user: 'u1',
          role: { $in: ['OWNER', 'AUTHOR'] }
        }
      }
    });
  });

  it('throws 401 when the dependent model does not yield a scenario id', async () => {
    const Slide = { findById: vi.fn().mockResolvedValue(null) };

    await expect(checkHasAccessToScenario(
      { modelId: 'missing', modelType: 'Slide' },
      { user: { _id: 'u1' }, models: { Slide, Scenario: {} } }
    )).rejects.toMatchObject({ statusCode: 401 });
  });

  it('throws 401 when the user is not a collaborator on the scenario', async () => {
    const Scenario = { findOne: vi.fn().mockResolvedValue(null) };

    await expect(checkHasAccessToScenario(
      { modelId: 's1', modelType: 'Scenario' },
      { user: { _id: 'u-stranger' }, models: { Scenario } }
    )).rejects.toMatchObject({ statusCode: 401, message: 'You do not have access to this scenario' });
  });
});
