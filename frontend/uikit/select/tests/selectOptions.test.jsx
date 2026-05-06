import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SelectOptions from './selectOptions.jsx';

const options = [
  { value: 'a', text: 'Apple' },
  { value: 'b', text: 'Banana' },
  { value: 'c', text: 'Cherry' }
];

describe('SelectOptions', () => {
  it('renders all options', () => {
    render(<SelectOptions options={options} value="a" onChange={() => {}} />);
    expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Banana' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Cherry' })).toBeInTheDocument();
  });

  it('selects the option matching the value prop', () => {
    render(<SelectOptions options={options} value="b" onChange={() => {}} />);
    expect(screen.getByRole('combobox')).toHaveValue('b');
  });

  it('fires onChange with the new value when the user selects a different option', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<SelectOptions options={options} value="a" onChange={onChange} />);
    await user.selectOptions(screen.getByRole('combobox'), 'c');

    expect(onChange).toHaveBeenCalledWith('c');
  });

  it('disables the select when isDisabled is true', () => {
    render(<SelectOptions options={options} value="a" isDisabled onChange={() => {}} />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });
});
