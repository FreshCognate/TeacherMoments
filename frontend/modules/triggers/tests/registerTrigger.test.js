import { describe, it, expect, beforeEach } from 'vitest';
import TRIGGERS from '../triggers';
import registerTrigger from '../helpers/registerTrigger';
import getTrigger from '../helpers/getTrigger';

describe('registerTrigger / getTrigger', () => {
  beforeEach(() => {
    Object.keys(TRIGGERS).forEach((key) => delete TRIGGERS[key]);
  });

  it('registers a trigger that can be retrieved by name', () => {
    const trigger = { getAction: () => 'TEST_TRIGGER' };
    registerTrigger('TEST_TRIGGER', trigger);
    expect(getTrigger('TEST_TRIGGER')).toBe(trigger);
  });

  it('overwrites an existing trigger when re-registered with the same name', () => {
    const first = { getAction: () => 'TEST_TRIGGER', version: 1 };
    const second = { getAction: () => 'TEST_TRIGGER', version: 2 };
    registerTrigger('TEST_TRIGGER', first);
    registerTrigger('TEST_TRIGGER', second);
    expect(getTrigger('TEST_TRIGGER')).toBe(second);
  });

  it('returns undefined for unregistered triggers', () => {
    expect(getTrigger('MISSING_TRIGGER')).toBeUndefined();
  });
});
