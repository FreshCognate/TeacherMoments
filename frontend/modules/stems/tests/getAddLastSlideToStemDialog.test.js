import { describe, it, expect } from 'vitest';
import getAddLastSlideToStemDialog from '../helpers/getAddLastSlideToStemDialog';

describe('getAddLastSlideToStemDialog', () => {
  it('uses add title and confirm text for ADD', () => {
    const dialog = getAddLastSlideToStemDialog('ADD');
    expect(dialog.title).toBe('Add slide');
    expect(dialog.actions[1]).toEqual({ type: 'CONFIRM', text: 'Add slide', color: 'primary' });
  });

  it('uses duplicate title and confirm text for DUPLICATE', () => {
    const dialog = getAddLastSlideToStemDialog('DUPLICATE');
    expect(dialog.title).toBe('Duplicate slide');
    expect(dialog.actions[1]).toEqual({ type: 'CONFIRM', text: 'Duplicate slide', color: 'primary' });
  });

  it('includes a cancel action', () => {
    const dialog = getAddLastSlideToStemDialog('ADD');
    expect(dialog.actions[0]).toEqual({ type: 'CANCEL', text: 'Cancel' });
  });
});
