import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import sortBy from 'lodash/sortBy.js';
import { setupMongo } from '../../../../tests/with-mongo.js';

const { checkAccessMock, setHasChangesMock } = vi.hoisted(() => ({
  checkAccessMock: vi.fn(),
  setHasChangesMock: vi.fn()
}));

vi.mock('../../scenarios/helpers/checkHasAccessToScenario.js', () => ({ default: (...args) => checkAccessMock(...args) }));
vi.mock('../../scenarios/services/setScenarioHasChanges.js', () => ({ default: (...args) => setHasChangesMock(...args) }));

import reorderTrigger from '../services/reorderTrigger.js';

const db = setupMongo();

const makeTrigger = (scenario, elementRef, sortOrder) => db.models.Trigger.create({
  scenario, elementRef, triggerType: 'SLIDE', action: 'SHOW_FEEDBACK_FROM_PROMPTS', sortOrder
});

describe('reorderTrigger (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
  });

  it('returns null when neither sourceIndex nor destinationIndex is set', async () => {
    const result = await reorderTrigger({ triggerId: new mongoose.Types.ObjectId() }, {}, { models: db.models });
    expect(result).toBeNull();
    expect(checkAccessMock).not.toHaveBeenCalled();
  });

  it('returns null and skips work when source === destination', async () => {
    const result = await reorderTrigger(
      { sourceIndex: 1, destinationIndex: 1, triggerId: new mongoose.Types.ObjectId() },
      {},
      { models: db.models, user: { _id: new mongoose.Types.ObjectId() } }
    );
    expect(result).toBeNull();
    expect(checkAccessMock).toHaveBeenCalled();
  });

  it('throws 404 when the trigger does not exist', async () => {
    await expect(
      reorderTrigger(
        { sourceIndex: 0, destinationIndex: 1, triggerId: new mongoose.Types.ObjectId() },
        {},
        { models: db.models, user: { _id: new mongoose.Types.ObjectId() } }
      )
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it('splices the trigger to the destination index and renumbers its element siblings', async () => {
    const scenario = new mongoose.Types.ObjectId();
    const elementRef = new mongoose.Types.ObjectId();
    const [a, b, c] = await Promise.all([
      makeTrigger(scenario, elementRef, 0),
      makeTrigger(scenario, elementRef, 1),
      makeTrigger(scenario, elementRef, 2)
    ]);

    const ctx = { models: db.models, user: { _id: new mongoose.Types.ObjectId() } };
    const result = await reorderTrigger({ sourceIndex: 0, destinationIndex: 2, triggerId: a._id }, {}, ctx);

    const ordered = sortBy(await db.models.Trigger.find({ scenario, elementRef, isDeleted: false }).lean(), 'sortOrder');
    expect(ordered.map((t) => String(t._id))).toEqual([String(b._id), String(c._id), String(a._id)]);

    expect(setHasChangesMock).toHaveBeenCalledWith({ scenarioId: scenario }, {}, ctx);
    expect(String(result._id)).toBe(String(a._id));
  });
});
