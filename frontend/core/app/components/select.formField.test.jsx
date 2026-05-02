import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import './select.formField.jsx';
import Fields from '~/core/forms/forms.fields';

const SelectFormField = Fields.Select;

const options = [
  { value: 'a', text: 'Apple' },
  { value: 'b', text: 'Banana' }
];

describe('SelectFormField', () => {
  it('renders all schema.options and selects the current value', () => {
    render(<SelectFormField value="a" schema={{ options }} updateField={() => {}} />);
    expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Banana' })).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveValue('a');
  });

  it('fires updateField with the new value when the user changes the selection', async () => {
    const user = userEvent.setup();
    const updateField = vi.fn();

    render(<SelectFormField value="a" schema={{ options }} updateField={updateField} />);
    await user.selectOptions(screen.getByRole('combobox'), 'b');

    expect(updateField).toHaveBeenCalledWith('b');
  });
});
