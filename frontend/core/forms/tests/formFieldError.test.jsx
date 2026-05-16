import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FormFieldError from '../components/formFieldError.jsx';

describe('FormFieldError', () => {
  it('returns null when hasError is false', () => {
    const { container } = render(<FormFieldError hasError={false} error="Required" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the error string when hasError is true', () => {
    render(<FormFieldError hasError error="Required" />);
    expect(screen.getByText('Required')).toBeInTheDocument();
  });
});
