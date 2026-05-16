import { describe, it, expect, beforeEach } from 'vitest';
import TRIGGERS from '../triggers';
import getTriggers from '../helpers/getTriggers';

describe('getTriggers', () => {
  beforeEach(() => {
    Object.keys(TRIGGERS).forEach((key) => delete TRIGGERS[key]);
  });

  it('returns an empty list when no triggers are registered', () => {
    expect(getTriggers()).toEqual([]);
  });

  it('returns one option per registered trigger using each trigger\'s action and text', () => {
    TRIGGERS.SHOW_FEEDBACK = {
      getAction: () => 'SHOW_FEEDBACK',
      getText: () => 'Show feedback'
    };
    TRIGGERS.NAVIGATE = {
      getAction: () => 'NAVIGATE',
      getText: () => 'Navigate to slide'
    };

    expect(getTriggers()).toEqual([
      { value: 'SHOW_FEEDBACK', text: 'Show feedback' },
      { value: 'NAVIGATE', text: 'Navigate to slide' }
    ]);
  });
});
