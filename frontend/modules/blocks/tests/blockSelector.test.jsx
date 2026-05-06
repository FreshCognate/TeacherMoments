import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlockSelector from '../components/blockSelector.jsx';

const blocks = [
  { blockType: 'TEXT', displayName: 'Text', description: 'Add text' },
  { blockType: 'IMAGES', displayName: 'Images', description: 'Add images' }
];

describe('BlockSelector', () => {
  it('renders an entry per block type with display name and description', () => {
    render(<BlockSelector blocks={blocks} onAddBlockTypeClicked={() => {}} />);
    expect(screen.getByText('Text')).toBeInTheDocument();
    expect(screen.getByText('Add text')).toBeInTheDocument();
    expect(screen.getByText('Images')).toBeInTheDocument();
    expect(screen.getByText('Add images')).toBeInTheDocument();
  });

  it('fires onAddBlockTypeClicked with the blockType when an entry is clicked', async () => {
    const user = userEvent.setup();
    const onAddBlockTypeClicked = vi.fn();

    render(<BlockSelector blocks={blocks} onAddBlockTypeClicked={onAddBlockTypeClicked} />);
    await user.click(screen.getByText('Images'));

    expect(onAddBlockTypeClicked).toHaveBeenCalledWith('IMAGES');
  });
});
