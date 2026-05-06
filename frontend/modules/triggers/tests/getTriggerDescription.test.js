import { describe, it, expect, beforeEach } from 'vitest';
import TRIGGERS from '../triggers';
import getTriggerDescription from '../helpers/getTriggerDescription';

describe('getTriggerDescription', () => {
  beforeEach(() => {
    Object.keys(TRIGGERS).forEach((key) => delete TRIGGERS[key]);
  });

  it('delegates to the registered trigger\'s getDescription', () => {
    TRIGGERS.SHOW_FEEDBACK = {
      getDescription: (trigger) => `Description for ${trigger._id}`
    };

    expect(getTriggerDescription({ _id: 't1', action: 'SHOW_FEEDBACK' })).toBe('Description for t1');
  });

  it('returns undefined and warns when the trigger is not registered', () => {
    expect(getTriggerDescription({ action: 'MISSING' })).toBeUndefined();
  });
});
