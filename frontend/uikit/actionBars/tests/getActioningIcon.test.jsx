import { describe, it, expect } from 'vitest';
import getActioningIcon from '../helpers/getActioningIcon.jsx';

describe('getActioningIcon', () => {
  it('returns "paste" for the duplicate action', () => {
    expect(getActioningIcon('duplicate')).toBe('paste');
  });

  it('returns "move" for the move action', () => {
    expect(getActioningIcon('move')).toBe('move');
  });

  it('returns undefined for unknown action types', () => {
    expect(getActioningIcon('unknown')).toBeUndefined();
  });
});
