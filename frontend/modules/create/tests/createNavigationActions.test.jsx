import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateNavigationActions from '../components/createNavigationActions';

const baseProps = {
  isCreating: false,
  isDuplicating: false,
  onAddSlideClicked: () => {}
};

describe('CreateNavigationActions', () => {
  it('renders the Add slide button', () => {
    render(<CreateNavigationActions {...baseProps} />);
    expect(screen.getByRole('button', { name: /Add slide/ })).toBeInTheDocument();
  });

  it('fires onAddSlideClicked when the Add slide button is clicked', async () => {
    const user = userEvent.setup();
    const onAddSlideClicked = vi.fn();

    render(<CreateNavigationActions {...baseProps} onAddSlideClicked={onAddSlideClicked} />);
    await user.click(screen.getByRole('button', { name: /Add slide/ }));

    expect(onAddSlideClicked).toHaveBeenCalledTimes(1);
  });

  it('disables the Add slide button when isCreating is true', () => {
    render(<CreateNavigationActions {...baseProps} isCreating={true} />);
    expect(screen.getByRole('button', { name: /Add slide/ })).toBeDisabled();
  });

  it('renders the creating-slide status text when isCreating is true', () => {
    render(<CreateNavigationActions {...baseProps} isCreating={true} />);
    expect(screen.getByText('Creating slide...')).toBeInTheDocument();
  });

  it('renders the duplicating-slide status text when isDuplicating is true', () => {
    render(<CreateNavigationActions {...baseProps} isDuplicating={true} />);
    expect(screen.getByText('Duplicating slide...')).toBeInTheDocument();
  });
});
