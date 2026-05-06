import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Options from '../components/options.jsx';

const noop = () => {};

describe('Options', () => {
  it('renders the trigger with the given text and title', () => {
    render(
      <Options
        text="More"
        title="More actions"
        options={[]}
        isOpen={false}
        onToggle={noop}
        onOptionClicked={noop}
      />
    );
    expect(screen.getByRole('button', { name: 'More' })).toBeInTheDocument();
    expect(screen.getByTitle('More actions')).toBeInTheDocument();
  });

  it('does not render the option list when closed', () => {
    render(
      <Options
        options={[{ icon: 'edit', text: 'Edit', action: 'edit' }]}
        isOpen={false}
        onToggle={noop}
        onOptionClicked={noop}
      />
    );
    expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument();
  });

  it('renders each option when open', () => {
    render(
      <Options
        options={[
          { icon: 'edit', text: 'Edit', action: 'edit' },
          { icon: 'delete', text: 'Delete', action: 'delete' }
        ]}
        isOpen={true}
        onToggle={noop}
        onOptionClicked={noop}
      />
    );
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('fires onOptionClicked with the option action when an option is clicked', async () => {
    const user = userEvent.setup();
    const onOptionClicked = vi.fn();

    render(
      <Options
        options={[{ icon: 'delete', text: 'Delete', action: 'delete' }]}
        isOpen={true}
        onToggle={noop}
        onOptionClicked={onOptionClicked}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onOptionClicked).toHaveBeenCalledWith('delete');
  });

  it('calls onToggle(false) when clicking outside', () => {
    const onToggle = vi.fn();

    render(
      <div>
        <Options
          options={[]}
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
