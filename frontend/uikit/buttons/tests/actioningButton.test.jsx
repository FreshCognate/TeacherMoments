import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ActioningButton from './actioningButton.jsx';

describe('ActioningButton', () => {
  it('fires onActionClicked with the position when clicked', async () => {
    const user = userEvent.setup();
    const onActionClicked = vi.fn();

    render(
      <ActioningButton
        actionType="duplicate"
        position={3}
        onActionClicked={onActionClicked}
      />
    );

    await user.click(screen.getByRole('button'));
    expect(onActionClicked).toHaveBeenCalledWith(3);
  });

  it('renders an icon for the given actionType', () => {
    const { container } = render(
      <ActioningButton
        actionType="duplicate"
        position={0}
        onActionClicked={() => {}}
      />
    );

    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
