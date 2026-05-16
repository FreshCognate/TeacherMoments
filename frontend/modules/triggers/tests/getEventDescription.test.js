import { describe, it, expect } from 'vitest';
import getEventDescription from '../helpers/getEventDescription';

describe('getEventDescription', () => {
  it('returns "On exit slide" for SLIDE triggers', () => {
    expect(getEventDescription({ triggerType: 'SLIDE' })).toBe('On exit slide');
  });
});
