import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('~/core/forms/containers/formContainer', () => ({
  default: () => <div data-testid="form-stub">form</div>
}));

import CreateStaticSlideEditor from '../components/createStaticSlideEditor';

const baseProps = {
  schema: {},
  scenario: { _id: 'scenario-1' },
  title: 'Consent settings',
  isLoading: false,
  onUpdate: () => {}
};

describe('CreateStaticSlideEditor', () => {
  it('renders nothing when isLoading is true', () => {
    const { container } = render(<CreateStaticSlideEditor {...baseProps} isLoading={true} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the title and the form when not loading', () => {
    render(<CreateStaticSlideEditor {...baseProps} />);
    expect(screen.getByText('Consent settings')).toBeInTheDocument();
    expect(screen.getByTestId('form-stub')).toBeInTheDocument();
  });
});
