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

import deleteTriggerById from '../services/deleteTriggerById.js';

const db = setupMongo();

const makeTrigger = (scenario, elementRef, sortOrder) => db.models.Trigger.create({
  scenario, elementRef, triggerType: 'SLIDE', action: 'SHOW_FEEDBACK_FROM_PROMPTS', sortOrder
});

describe('deleteTriggerById (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
  });

  it('throws 404 when the trigger does not exist', async () => {
    await expect(
      deleteTriggerById({ triggerId: new mongoose.Types.ObjectId() }, {}, { models: db.models, user: { _id: new mongoose.Types.ObjectId() } })
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it('soft-deletes the trigger and renumbers its element siblings, marking the scenario changed', async () => {
    const scenario = new mongoose.Types.ObjectId();
    const elementRef = new mongoose.Types.ObjectId();
    const [first, second, third] = await Promise.all([
      makeTrigger(scenario, elementRef, 0),
      makeTrigger(scenario, elementRef, 1),
      makeTrigger(scenario, elementRef, 2)
    ]);

    const ctx = { models: db.models, user: { _id: new mongoose.Types.ObjectId() } };
    const result = await deleteTriggerById({ triggerId: second._id }, {}, ctx);

    const deleted = await db.models.Trigger.findById(second._id).lean();
    expect(deleted.isDeleted).toBe(true);

    const remaining = sortBy(await db.models.Trigger.find({ scenario, elementRef, isDeleted: false }).lean(), 'sortOrder');
    expect(remaining.map((t) => t.sortOrder)).toEqual([0, 1]);
    expect(remaining.map((t) => String(t._id))).toEqual([String(first._id), String(third._id)]);

    expect(setHasChangesMock).toHaveBeenCalledWith({ scenarioId: scenario }, {}, ctx);
    expect(String(result._id)).toBe(String(second._id));
  });
});
