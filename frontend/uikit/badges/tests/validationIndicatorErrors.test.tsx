import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ValidationIndicatorErrors from '../components/validationIndicatorErrors';

const errors = [
  { message: 'Block is missing a prompt', elementType: 'BLOCK', elementId: 'b1' },
  { message: 'Slide has no title', elementType: 'SLIDE', elementId: 's1' },
  { message: 'Trigger has no target', elementType: 'TRIGGER', elementId: 't1' }
];

describe('ValidationIndicatorErrors', () => {
  it('renders each error message', () => {
    render(<ValidationIndicatorErrors errors={errors} onErrorClicked={() => {}} />);

    expect(screen.getByText('Block is missing a prompt')).toBeInTheDocument();
    expect(screen.getByText('Slide has no title')).toBeInTheDocument();
    expect(screen.getByText('Trigger has no target')).toBeInTheDocument();
  });

  it('renders a human-readable element label for each error', () => {
    render(<ValidationIndicatorErrors errors={errors} onErrorClicked={() => {}} />);

    expect(screen.getByText('Element: Block')).toBeInTheDocument();
    expect(screen.getByText('Element: Slide')).toBeInTheDocument();
    expect(screen.getByText('Element: Trigger')).toBeInTheDocument();
  });

  it('fires onErrorClicked with the clicked error', async () => {
    const user = userEvent.setup();
    const onErrorClicked = vi.fn();

    render(<ValidationIndicatorErrors errors={errors} onErrorClicked={onErrorClicked} />);

    await user.click(screen.getByText('Slide has no title'));
    expect(onErrorClicked).toHaveBeenCalledWith(errors[1]);
  });
});
