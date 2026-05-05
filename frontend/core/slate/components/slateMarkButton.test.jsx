import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('../helpers/toggleMark', () => ({
  default: vi.fn(),
  isMarkActive: vi.fn()
}));

import toggleMark, { isMarkActive } from '../helpers/toggleMark';
import SlateMarkButton from './slateMarkButton.jsx';

describe('SlateMarkButton', () => {
  beforeEach(() => {
    isMarkActive.mockReset();
    toggleMark.mockReset();
  });

  it('calls toggleMark with the editor and format on mouseDown', () => {
    isMarkActive.mockReturnValue(false);
    const editor = { id: 'fake' };

    render(<SlateMarkButton editor={editor} format="bold" title="Bold" />);

    fireEvent.mouseDown(screen.getByTitle('Bold'));
    expect(toggleMark).toHaveBeenCalledWith(editor, 'bold');
  });

  it('applies the active class when isMarkActive returns true', () => {
    isMarkActive.mockReturnValue(true);

    render(<SlateMarkButton editor={{}} format="bold" title="Bold" />);
    expect(screen.getByTitle('Bold')).toHaveClass('text-primary-regular');
  });

  it('does not apply the active class when isMarkActive returns false', () => {
    isMarkActive.mockReturnValue(false);

    render(<SlateMarkButton editor={{}} format="bold" title="Bold" />);
    expect(screen.getByTitle('Bold')).not.toHaveClass('text-primary-regular');
  });
});
