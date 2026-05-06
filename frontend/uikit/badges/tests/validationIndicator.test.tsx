import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('../containers/validationIndicatorContainer', () => ({
  default: () => <div>stub</div>
}));

import ValidationIndicator from './validationIndicator';

const buildError = (overrides = {}) => ({
  message: 'Something is wrong',
  elementType: 'BLOCK',
  elementId: 'abc',
  ...overrides
});

describe('ValidationIndicator', () => {
  it('renders nothing when errors is an empty array', () => {
    const { container } = render(<ValidationIndicator errors={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders "1 issue" when there is exactly one error', () => {
    render(<ValidationIndicator errors={[buildError()]} />);
    expect(screen.getByText('1 issue')).toBeInTheDocument();
  });

  it('renders "{n} issues" when there are multiple errors', () => {
    render(
      <ValidationIndicator
        errors={[buildError(), buildError(), buildError()]}
      />
    );
    expect(screen.getByText('3 issues')).toBeInTheDocument();
  });

  it('starts with aria-expanded false and toggles to true when clicked', async () => {
    const user = userEvent.setup();
    render(<ValidationIndicator errors={[buildError()]} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'false');

    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('exposes an aria-label that describes the count', () => {
    render(<ValidationIndicator errors={[buildError(), buildError()]} />);
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      '2 validation issues. Click to view.'
    );
  });
});
