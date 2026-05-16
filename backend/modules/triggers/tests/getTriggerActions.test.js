import { describe, it, expect } from 'vitest';
import getTriggerActions from '../helpers/getTriggerActions.js';

describe('getTriggerActions', () => {
  it('returns the list of supported trigger action types', () => {
    expect(getTriggerActions()).toEqual(['SHOW_FEEDBACK_FROM_PROMPTS']);
  });
});
