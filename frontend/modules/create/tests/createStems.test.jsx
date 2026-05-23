import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateStems from '../components/createStems';

const childStems = [
  { _id: 'stem-1', ref: 'ref-1', name: 'Branch A' },
  { _id: 'stem-2', ref: 'ref-2', name: 'Branch B' }
];

const baseProps = {
  isInRootStem: true,
  childStems,
  deletingId: null,
  getSlideCountForStem: (ref) => (ref === 'ref-1' ? 3 : 1),
  onEditStemClicked: () => {},
  onDeleteStemClicked: () => {},
  onStemClicked: () => {}
};

describe('CreateStems', () => {
  it('renders one row per stem with the slide count', () => {
    render(<CreateStems {...baseProps} />);
    expect(screen.getByText('Branch A (3)')).toBeInTheDocument();
    expect(screen.getByText('Branch B (1)')).toBeInTheDocument();
  });

  it('fires onStemClicked with the stem ref when the row is clicked', async () => {
    const user = userEvent.setup();
    const onStemClicked = vi.fn();

    render(<CreateStems {...baseProps} onStemClicked={onStemClicked} />);
    await user.click(screen.getByText('Branch A (3)'));

    expect(onStemClicked).toHaveBeenCalledWith('ref-1');
  });

  it('fires onEditStemClicked with the stem when the Edit button is clicked', async () => {
    const user = userEvent.setup();
    const onEditStemClicked = vi.fn();

    render(<CreateStems {...baseProps} onEditStemClicked={onEditStemClicked} />);
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]);

    expect(onEditStemClicked).toHaveBeenCalledWith(childStems[0]);
  });

  it('fires onDeleteStemClicked with the stem id when the Delete button is clicked', async () => {
    const user = userEvent.setup();
    const onDeleteStemClicked = vi.fn();

    render(<CreateStems {...baseProps} onDeleteStemClicked={onDeleteStemClicked} />);
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[3]);

    expect(onDeleteStemClicked).toHaveBeenCalledWith('stem-2');
  });

  it('does not fire onStemClicked when the Edit button is clicked', async () => {
    const user = userEvent.setup();
    const onStemClicked = vi.fn();

    render(<CreateStems {...baseProps} onStemClicked={onStemClicked} />);
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]);

    expect(onStemClicked).not.toHaveBeenCalled();
  });

  it('renders the Delete button as disabled when the stem is being deleted', () => {
    render(<CreateStems {...baseProps} deletingId="stem-1" />);
    const buttons = screen.getAllByRole('button');
    expect(buttons[1]).toBeDisabled();
  });
});
