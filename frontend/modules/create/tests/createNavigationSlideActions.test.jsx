import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('~/uikit/badges/components/validationIndicator', () => ({
  default: ({ errors }) => (
    <div data-testid="validation-indicator">errors:{errors?.length ?? 0}</div>
  )
}));

vi.mock('~/uikit/dropdowns/components/options', () => ({
  default: ({ options, isOpen, onToggle, onOptionClicked }) => (
    <div data-testid="options-stub">
      <button onClick={() => onToggle(!isOpen)}>toggle</button>
      <span data-testid="options-is-open">{String(isOpen)}</span>
      {options.map((option) => (
        <button
          key={option.action}
          onClick={() => onOptionClicked(option.action)}
        >
          {option.text}
        </button>
      ))}
    </div>
  )
}));

import CreateNavigationSlideActions from '../components/createNavigationSlideActions';

const baseProps = {
  slideNumber: 3,
  isOptionsOpen: false,
  options: [{ action: 'DELETE', text: 'Delete' }],
  slideErrors: [],
  onSlideActionsToggle: () => {},
  onSlideActionClicked: () => {}
};

describe('CreateNavigationSlideActions', () => {
  it('renders the slide number', () => {
    render(<CreateNavigationSlideActions {...baseProps} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('passes slideErrors to the ValidationIndicator', () => {
    render(
      <CreateNavigationSlideActions
        {...baseProps}
        slideErrors={[{ message: 'oops' }, { message: 'oh no' }]}
      />
    );
    expect(screen.getByTestId('validation-indicator')).toHaveTextContent('errors:2');
  });

  it('renders the Options dropdown when there are options', () => {
    render(<CreateNavigationSlideActions {...baseProps} />);
    expect(screen.getByTestId('options-stub')).toBeInTheDocument();
  });

  it('does not render the Options dropdown when options is empty', () => {
    render(<CreateNavigationSlideActions {...baseProps} options={[]} />);
    expect(screen.queryByTestId('options-stub')).not.toBeInTheDocument();
  });

  it('reflects isOptionsOpen on the Options dropdown', () => {
    render(<CreateNavigationSlideActions {...baseProps} isOptionsOpen={true} />);
    expect(screen.getByTestId('options-is-open')).toHaveTextContent('true');
  });

  it('fires onSlideActionClicked with the action when an option is clicked', async () => {
    const user = userEvent.setup();
    const onSlideActionClicked = vi.fn();

    render(
      <CreateNavigationSlideActions
        {...baseProps}
        onSlideActionClicked={onSlideActionClicked}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(onSlideActionClicked).toHaveBeenCalledWith('DELETE');
  });
});
