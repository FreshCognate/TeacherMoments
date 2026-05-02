import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import './alert.formField.jsx';
import Fields from '~/core/forms/forms.fields';

const AlertFormField = Fields.Alert;

describe('AlertFormField', () => {
  it('renders an Alert with the schema-provided text', () => {
    render(<AlertFormField schema={{ alertType: 'info', alertText: 'Heads up!' }} />);
    expect(screen.getByText('Heads up!')).toBeInTheDocument();
  });

  it('passes the alertType through to the Alert (info shows the primary-coloured wrapper)', () => {
    const { container } = render(
      <AlertFormField schema={{ alertType: 'info', alertText: 'Heads up' }} />
    );
    expect(container.querySelector('.bg-primary-regular')).toBeInTheDocument();
  });
});
