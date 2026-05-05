import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DialogsModalActions from './dialogsModalActions.jsx';

describe('DialogsModalActions', () => {
  it('renders nothing when actions is empty or missing', () => {
    const { container } = render(<DialogsModalActions actions={[]} onActionClicked={() => {}} />);
    expect(container.firstChild).toBeNull();

    const { container: container2 } = render(<DialogsModalActions onActionClicked={() => {}} />);
    expect(container2.firstChild).toBeNull();
  });

  it('renders a button per action', () => {
    render(
      <DialogsModalActions
        actions={[
          { type: 'CANCEL', text: 'Cancel' },
          { type: 'CONFIRM', text: 'Confirm' }
        ]}
        onActionClicked={() => {}}
      />
    );
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
  });

  it('fires onActionClicked with the action type when an action is clicked', async () => {
    const user = userEvent.setup();
    const onActionClicked = vi.fn();

    render(
      <DialogsModalActions
        actions={[{ type: 'CONFIRM', text: 'Confirm' }]}
        onActionClicked={onActionClicked}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(onActionClicked).toHaveBeenCalledWith('CONFIRM');
  });

  it('disables an action when getIsDisabled returns true (called with modalData)', () => {
    const getIsDisabled = vi.fn(({ modalData }) => modalData.locked);

    render(
      <DialogsModalActions
        actions={[{ type: 'CONFIRM', text: 'Confirm', getIsDisabled }]}
        modalData={{ locked: true }}
        onActionClicked={() => {}}
      />
    );

    expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled();
    expect(getIsDisabled).toHaveBeenCalledWith({ modalData: { locked: true } });
  });
});
