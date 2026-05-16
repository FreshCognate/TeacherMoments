import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import duplicateTriggers from '../services/duplicateTriggers.js';

const FIXED_NOW = new Date('2026-05-08T12:00:00Z');

describe('duplicateTriggers', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('clones each non-deleted trigger under the new scenario, rewriting slide/block refs', async () => {
    const sourceTrigger = {
      _id: 'origId',
      ref: 'origRef',
      scenario: 'sOld',
      elementRef: 'slideRefOld',
      triggerType: 'SLIDE',
      action: 'SHOW_FEEDBACK_FROM_PROMPTS',
      items: [
        {
          conditions: [
            {
              prompts: [
                { ref: 'blockRefOld', text: 'p1' },
                { text: 'p2' }
              ]
            }
          ]
        }
      ]
    };

    const find = vi.fn().mockResolvedValue([sourceTrigger]);
    const create = vi.fn().mockResolvedValue([{ _id: 'newId' }]);

    const slideRefMap = new Map([['slideRefOld', 'slideRefNew']]);
    const blockRefMap = new Map([['blockRefOld', 'blockRefNew']]);

    await duplicateTriggers(
      { scenarioId: 'sOld', newScenarioId: 'sNew', slideRefMap, blockRefMap },
      { models: { Trigger: { find, create } }, session: 'SESSION_TOKEN' }
    );

    expect(find).toHaveBeenCalledWith({ scenario: 'sOld', isDeleted: false });

    const [createArgs, createOptions] = create.mock.calls[0];
    expect(createArgs).toHaveLength(1);

    const clone = createArgs[0];
    expect(clone._id).toBeUndefined();
    expect(clone.ref).toBeUndefined();
    expect(clone.scenario).toBe('sNew');
    expect(clone.elementRef).toBe('slideRefNew');
    expect(clone.triggerType).toBe('SLIDE');
    expect(clone.action).toBe('SHOW_FEEDBACK_FROM_PROMPTS');
    expect(clone.createdAt).toEqual(FIXED_NOW);

    // Item / condition / prompt _ids must be stripped, and prompt refs rewritten through blockRefMap
    expect(clone.items[0]._id).toBeUndefined();
    expect(clone.items[0].conditions[0]._id).toBeUndefined();
    expect(clone.items[0].conditions[0].prompts).toEqual([
      { ref: 'blockRefNew', text: 'p1' },
      { text: 'p2' }
    ]);

    expect(createOptions).toEqual({ session: 'SESSION_TOKEN' });
  });

  it('falls back to the original elementRef when no slideRef mapping exists', async () => {
    const sourceTrigger = {
      scenario: 'sOld',
      elementRef: { toString: () => 'unmappedRef' },
      items: []
    };

    const find = vi.fn().mockResolvedValue([sourceTrigger]);
    const create = vi.fn().mockResolvedValue([{}]);

    await duplicateTriggers(
      {
        scenarioId: 'sOld',
        newScenarioId: 'sNew',
        slideRefMap: new Map(),
        blockRefMap: new Map()
      },
      { models: { Trigger: { find, create } } }
    );

    expect(create.mock.calls[0][0][0].elementRef).toEqual(sourceTrigger.elementRef);
  });

  it('handles triggers with sub-documents that have a toObject method', async () => {
    const item = {
      conditions: [{ prompts: [{ text: 'p1' }] }],
      toObject: vi.fn(function () { return { conditions: this.conditions }; })
    };
    const sourceTrigger = {
      scenario: 'sOld',
      elementRef: 'slideRefOld',
      items: [item]
    };

    const find = vi.fn().mockResolvedValue([sourceTrigger]);
    const create = vi.fn().mockResolvedValue([{}]);

    await duplicateTriggers(
      {
        scenarioId: 'sOld',
        newScenarioId: 'sNew',
        slideRefMap: new Map([['slideRefOld', 'slideRefNew']]),
        blockRefMap: new Map()
      },
      { models: { Trigger: { find, create } } }
    );

    expect(item.toObject).toHaveBeenCalled();
  });
});
