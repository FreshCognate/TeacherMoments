import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('~/modules/flags/components/flag', () => ({
  default: ({ children }) => <>{children}</>
}));

import CreateNavigationActions from '../components/createNavigationActions';

const baseProps = {
  isCreating: false,
  isDuplicating: false,
  onAddSlideClicked: () => {},
  onCreateStemClicked: () => {}
};

describe('CreateNavigationActions', () => {
  it('renders the Add slide and Create Stem buttons', () => {
    render(<CreateNavigationActions {...baseProps} />);
    expect(screen.getByRole('button', { name: /Add slide/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Stem/ })).toBeInTheDocument();
  });

  it('fires onAddSlideClicked when the Add slide button is clicked', async () => {
    const user = userEvent.setup();
    const onAddSlideClicked = vi.fn();

    render(<CreateNavigationActions {...baseProps} onAddSlideClicked={onAddSlideClicked} />);
    await user.click(screen.getByRole('button', { name: /Add slide/ }));

    expect(onAddSlideClicked).toHaveBeenCalledTimes(1);
  });

  it('fires onCreateStemClicked when the Create Stem button is clicked', async () => {
    const user = userEvent.setup();
    const onCreateStemClicked = vi.fn();

    render(<CreateNavigationActions {...baseProps} onCreateStemClicked={onCreateStemClicked} />);
    await user.click(screen.getByRole('button', { name: /Create Stem/ }));

    expect(onCreateStemClicked).toHaveBeenCalledTimes(1);
  });

  it('disables the Add slide and Create Stem buttons when isCreating is true', () => {
    render(<CreateNavigationActions {...baseProps} isCreating={true} />);
    expect(screen.getByRole('button', { name: /Add slide/ })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Create Stem/ })).toBeDisabled();
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
