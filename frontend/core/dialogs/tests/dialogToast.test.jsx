import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DialogToast from '../components/dialogToast.jsx';

describe('DialogToast', () => {
  it('renders the title and body', () => {
    render(<DialogToast title="Saved" body="Your changes are saved" onActionClicked={() => {}} />);
    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(screen.getByText('Your changes are saved')).toBeInTheDocument();
  });

  it('renders an icon when icon is provided', () => {
    const { container } = render(<DialogToast icon="confirm" title="Saved" onActionClicked={() => {}} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders an action button per action and forwards id + type to onActionClicked', async () => {
    const user = userEvent.setup();
    const onActionClicked = vi.fn();

    render(
      <DialogToast
        id="toast-1"
        title="Saved"
        actions={[{ type: 'UNDO', text: 'Undo' }]}
        onActionClicked={onActionClicked}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Undo' }));
    expect(onActionClicked).toHaveBeenCalledWith('toast-1', 'UNDO');
  });

  it('applies the centered position class when position is "center"', () => {
    const { container } = render(
      <DialogToast title="x" position="center" onActionClicked={() => {}} />
    );
    expect(container.querySelector('.fixed')).toBeInTheDocument();
  });
});
