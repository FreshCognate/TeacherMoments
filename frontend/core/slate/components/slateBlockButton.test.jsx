import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('../helpers/toggleBlock', () => ({
  default: vi.fn(),
  isBlockActive: vi.fn()
}));

import toggleBlock, { isBlockActive } from '../helpers/toggleBlock';
import SlateBlockButton from './slateBlockButton.jsx';

describe('SlateBlockButton', () => {
  beforeEach(() => {
    isBlockActive.mockReset();
    toggleBlock.mockReset();
  });

  it('calls toggleBlock with the editor and format on mouseDown', () => {
    isBlockActive.mockReturnValue(false);
    const editor = { id: 'fake' };

    render(<SlateBlockButton editor={editor} format="numberedList" title="Numbered" />);

    fireEvent.mouseDown(screen.getByTitle('Numbered'));
    expect(toggleBlock).toHaveBeenCalledWith(editor, 'numberedList');
  });

  it('checks isBlockActive against "type" for non-align formats', () => {
    isBlockActive.mockReturnValue(false);

    render(<SlateBlockButton editor={{}} format="bulletedList" title="Bullets" />);
    expect(isBlockActive).toHaveBeenCalledWith({}, 'bulletedList', 'type');
  });

  it('checks isBlockActive against "align" for text-align formats', () => {
    isBlockActive.mockReturnValue(false);

    render(<SlateBlockButton editor={{}} format="center" title="Center" />);
    expect(isBlockActive).toHaveBeenCalledWith({}, 'center', 'align');
  });

  it('applies the active class when isBlockActive returns true', () => {
    isBlockActive.mockReturnValue(true);

    render(<SlateBlockButton editor={{}} format="bulletedList" title="Bullets" />);
    expect(screen.getByTitle('Bullets')).toHaveClass('text-primary-regular');
  });
});
