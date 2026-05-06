import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dropdown from './dropdown.jsx';

const noop = () => {};

describe('Dropdown', () => {
  it('renders the placeholder', () => {
    render(
      <Dropdown
        placeholder="Choose one"
        isOpen={false}
        onToggle={noop}
        onOptionClicked={noop}
      />
    );
    expect(screen.getByText('Choose one')).toBeInTheDocument();
  });

  it('does not render options when closed', () => {
    render(
      <Dropdown
        placeholder="Choose one"
        options={[{ value: 'a', text: 'Apple' }]}
        isOpen={false}
        onToggle={noop}
        onOptionClicked={noop}
      />
    );
    expect(screen.queryByText('Apple')).not.toBeInTheDocument();
  });

  it('calls onToggle when the placeholder button is clicked', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();

    render(
      <Dropdown
        placeholder="Choose one"
        isOpen={false}
        onToggle={onToggle}
        onOptionClicked={noop}
      />
    );

    await user.click(screen.getByText('Choose one'));
    expect(onToggle).toHaveBeenCalledWith(true);
  });

  it('renders all options when open', () => {
    render(
      <Dropdown
        placeholder="Pick fruit"
        options={[
          { value: 'a', text: 'Apple' },
          { value: 'b', text: 'Banana' },
          { value: 'c', text: 'Cherry' }
        ]}
        isOpen={true}
        onToggle={noop}
        onOptionClicked={noop}
      />
    );

    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Banana')).toBeInTheDocument();
    expect(screen.getByText('Cherry')).toBeInTheDocument();
  });

  it('fires onOptionClicked with the value and closes the dropdown when an option is clicked', async () => {
    const user = userEvent.setup();
    const onOptionClicked = vi.fn();
    const onToggle = vi.fn();

    render(
      <Dropdown
        placeholder="Pick fruit"
        options={[
          { value: 'a', text: 'Apple' },
          { value: 'b', text: 'Banana' }
        ]}
        isOpen={true}
        onToggle={onToggle}
        onOptionClicked={onOptionClicked}
      />
    );

    await user.click(screen.getByText('Banana'));

    expect(onOptionClicked).toHaveBeenCalledWith('b');
    expect(onToggle).toHaveBeenCalledWith(false);
  });

  it('falls back to option.action when no value is set', async () => {
    const user = userEvent.setup();
    const onOptionClicked = vi.fn();

    render(
      <Dropdown
        placeholder="Actions"
        options={[{ action: 'delete', text: 'Delete' }]}
        isOpen={true}
        onToggle={noop}
        onOptionClicked={onOptionClicked}
      />
    );

    await user.click(screen.getByText('Delete'));
    expect(onOptionClicked).toHaveBeenCalledWith('delete');
  });

  it('renders a separator div without a button for options with separator: true', () => {
    const { container } = render(
      <Dropdown
        placeholder="Pick fruit"
        options={[
          { value: 'a', text: 'Apple' },
          { separator: true },
          { value: 'b', text: 'Banana' }
        ]}
        isOpen={true}
        onToggle={noop}
        onOptionClicked={noop}
      />
    );

    expect(screen.getAllByRole('button')).toHaveLength(3);
    expect(container.querySelector('.h-px')).toBeInTheDocument();
  });

  it('applies the position class based on the position prop', () => {
    const { container, rerender } = render(
      <Dropdown
        placeholder="Pick fruit"
        options={[{ value: 'a', text: 'Apple' }]}
        isOpen={true}
        onToggle={noop}
        onOptionClicked={noop}
      />
    );

    expect(container.querySelector('.right-0')).toBeInTheDocument();

    rerender(
      <Dropdown
        placeholder="Pick fruit"
        options={[{ value: 'a', text: 'Apple' }]}
        isOpen={true}
        position="left"
        onToggle={noop}
        onOptionClicked={noop}
      />
    );

    expect(container.querySelector('.left-0')).toBeInTheDocument();
  });

  it('renders a single child element passed as children', () => {
    render(
      <Dropdown
        placeholder="Menu"
        isOpen={true}
        onToggle={noop}
        onOptionClicked={noop}
      >
        <div>Custom content</div>
      </Dropdown>
    );

    expect(screen.getByText('Custom content')).toBeInTheDocument();
  });

  it('renders multiple children passed as an array', () => {
    render(
      <Dropdown
        placeholder="Menu"
        isOpen={true}
        onToggle={noop}
        onOptionClicked={noop}
      >
        <div>First</div>
        <div>Second</div>
      </Dropdown>
    );

    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });

  it('closes the dropdown when clicking outside', () => {
    const onToggle = vi.fn();

    render(
      <div>
        <Dropdown
          placeholder="Menu"
          options={[{ value: 'a', text: 'Apple' }]}
          isOpen={true}
          onToggle={onToggle}
          onOptionClicked={noop}
        />
        <button type="button">Outside</button>
      </div>
    );

    fireEvent.mouseDown(screen.getByText('Outside'));
    expect(onToggle).toHaveBeenCalledWith(false);
  });
});
