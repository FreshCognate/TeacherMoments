import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import './toggle.formField.jsx';
import Fields from '~/core/forms/forms.fields';

const FormsFieldToggle = Fields.Toggle;

const options = [
  { value: 'on', text: 'On' },
  { value: 'off', text: 'Off' }
];

describe('FormsFieldToggle', () => {
  it('renders a button for each schema option', () => {
    render(<FormsFieldToggle value="on" schema={{ options }} updateField={() => {}} />);
    expect(screen.getByRole('button', { name: 'On' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Off' })).toBeInTheDocument();
  });

  it('fires updateField with the option value when an option is clicked', async () => {
    const user = userEvent.setup();
    const updateField = vi.fn();

    render(<FormsFieldToggle value="on" schema={{ options }} updateField={updateField} />);
    await user.click(screen.getByRole('button', { name: 'Off' }));

    expect(updateField).toHaveBeenCalledWith('off');
  });
});
