import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfirmButton from './confirmButton.jsx';

describe('ConfirmButton', () => {
  it('renders the text and title initially, with no confirm button visible', () => {
    render(
      <ConfirmButton
        text="Delete"
        title="Delete item"
        icon="delete"
        onClick={() => {}}
      />
    );

    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByTitle('Delete item')).toBeInTheDocument();
    expect(screen.queryByTitle('Confirm')).not.toBeInTheDocument();
  });

  it('enters the confirming state when clicked, swapping in the cancel and confirm buttons', async () => {
    const user = userEvent.setup();

    render(
      <ConfirmButton
        text="Delete"
        title="Delete item"
        icon="delete"
        onClick={() => {}}
      />
    );

    await user.click(screen.getByTitle('Delete item'));

    expect(screen.getByTitle('Cancel')).toBeInTheDocument();
    expect(screen.getByTitle('Confirm')).toBeInTheDocument();
    expect(screen.queryByTitle('Delete item')).not.toBeInTheDocument();
  });

  it('fires onClick when the confirm button is clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <ConfirmButton
        text="Delete"
        title="Delete item"
        icon="delete"
        onClick={onClick}
      />
    );

    await user.click(screen.getByTitle('Delete item'));
    await user.click(screen.getByTitle('Confirm'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('exits the confirming state when clicking outside', () => {
    render(
      <div>
        <ConfirmButton
          text="Delete"
          title="Delete item"
          icon="delete"
          onClick={() => {}}
        />
        <div>outside</div>
      </div>
    );

    fireEvent.click(screen.getByTitle('Delete item'));
    expect(screen.getByTitle('Confirm')).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByText('outside'));
    expect(screen.queryByTitle('Confirm')).not.toBeInTheDocument();
  });
});
