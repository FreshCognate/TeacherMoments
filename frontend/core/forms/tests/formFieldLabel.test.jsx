import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FormFieldLabel from '../components/formFieldLabel.jsx';

describe('FormFieldLabel', () => {
  it('returns null when no label is provided', () => {
    const { container } = render(<FormFieldLabel label="" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the label text and links to the field via htmlFor', () => {
    const { container } = render(<FormFieldLabel label="Name" fieldId="field-1" />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(container.querySelector('label')).toHaveAttribute('for', 'field-1');
  });

  it('renders a tooltip trigger when tooltip content is provided', () => {
    render(<FormFieldLabel label="Name" tooltip="Helpful info" />);
    expect(screen.getByRole('button', { name: 'More information' })).toBeInTheDocument();
  });

  it('does not render a tooltip when tooltip is empty', () => {
    render(<FormFieldLabel label="Name" />);
    expect(screen.queryByRole('button', { name: 'More information' })).not.toBeInTheDocument();
  });
});
