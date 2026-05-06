import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Search from '../components/search';

describe('Search', () => {
  it('renders the input with the placeholder', () => {
    render(<Search value="" placeholder="Search scenarios" onChange={() => {}} />);
    expect(screen.getByPlaceholderText('Search scenarios')).toBeInTheDocument();
  });

  it('renders the value prop in the input', () => {
    render(<Search value="hello" onChange={() => {}} />);
    expect(screen.getByDisplayValue('hello')).toBeInTheDocument();
  });

  it('fires onChange with the new value when the user types', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Search value="" placeholder="Search" onChange={onChange} />);
    await user.type(screen.getByPlaceholderText('Search'), 'a');
    expect(onChange).toHaveBeenCalledWith('a');
  });

  it('fires onSearch with the current value when Enter is pressed', () => {
    const onSearch = vi.fn();
    render(<Search value="hello" onChange={() => {}} onSearch={onSearch} />);

    fireEvent.keyDown(screen.getByDisplayValue('hello'), { key: 'Enter' });
    expect(onSearch).toHaveBeenCalledWith('hello');
  });

  it('forwards keyDown events to onKeyDown when provided, bypassing onSearch', () => {
    const onKeyDown = vi.fn();
    const onSearch = vi.fn();
    render(
      <Search value="hello" onChange={() => {}} onKeyDown={onKeyDown} onSearch={onSearch} />
    );

    fireEvent.keyDown(screen.getByDisplayValue('hello'), { key: 'Enter' });
    expect(onKeyDown).toHaveBeenCalled();
    expect(onSearch).not.toHaveBeenCalled();
  });
});
