import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import './text.formField.jsx';
import Fields from '~/core/forms/forms.fields';

const TextFormField = Fields.Text;

describe('TextFormField', () => {
  it('renders a text input with the current value', () => {
    render(<TextFormField value="hello" schema={{}} updateField={() => {}} />);
    expect(screen.getByDisplayValue('hello')).toBeInTheDocument();
  });

  it('uses schema.textType for the input type when provided', () => {
    const { container } = render(
      <TextFormField value="" schema={{ textType: 'email' }} updateField={() => {}} />
    );
    expect(container.querySelector('input')).toHaveAttribute('type', 'email');
  });

  it('disables the input when schema.isDisabled is true', () => {
    render(<TextFormField value="" schema={{ isDisabled: true }} updateField={() => {}} />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('fires updateField with the new value on change', () => {
    const updateField = vi.fn();
    render(<TextFormField value="" schema={{}} updateField={updateField} />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'world' } });
    expect(updateField).toHaveBeenCalledWith('world');
  });
});
