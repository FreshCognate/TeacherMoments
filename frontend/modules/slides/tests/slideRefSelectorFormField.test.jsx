import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('~/uikit/content/components/body', () => ({
  default: ({ body }) => <span>{body}</span>
}));

vi.mock('~/uikit/icons/components/icon', () => ({
  default: ({ icon }) => <span data-icon={icon} />
}));

vi.mock('~/core/app/hooks/useOnClickOutside', () => ({
  default: () => {}
}));

import SlideRefSelector from '../components/slideRefSelector.formField';

const baseProps = {
  selectedSlideName: 'Intro',
  searchValue: '',
  options: [
    { value: 'slide-2', text: 'Middle' },
    { value: 'slide-3', text: 'End' }
  ],
  isDropdownOpen: false,
  onToggleDropdown: vi.fn(),
  onSlideSelected: vi.fn(),
  onSearchInputChanged: vi.fn()
};

describe('SlideRefSelectorFormField', () => {
  it('shows the selected slide name when one is provided', () => {
    render(<SlideRefSelector {...baseProps} />);
    expect(screen.getByText('Intro')).toBeInTheDocument();
  });

  it('shows a placeholder when there is no selected slide', () => {
    render(<SlideRefSelector {...baseProps} selectedSlideName={null} />);
    expect(screen.getByText('Select a slide...')).toBeInTheDocument();
  });

  it('does not render the dropdown when isDropdownOpen is false', () => {
    render(<SlideRefSelector {...baseProps} />);
    expect(screen.queryByPlaceholderText('Search slides...')).not.toBeInTheDocument();
    expect(screen.queryByText('Middle')).not.toBeInTheDocument();
  });

  it('renders the dropdown with options when isDropdownOpen is true', () => {
    render(<SlideRefSelector {...baseProps} isDropdownOpen={true} />);
    expect(screen.getByPlaceholderText('Search slides...')).toBeInTheDocument();
    expect(screen.getByText('Middle')).toBeInTheDocument();
    expect(screen.getByText('End')).toBeInTheDocument();
  });

  it('toggles the dropdown when the trigger row is clicked', async () => {
    const user = userEvent.setup();
    const onToggleDropdown = vi.fn();
    render(<SlideRefSelector {...baseProps} onToggleDropdown={onToggleDropdown} />);

    await user.click(screen.getByText('Intro'));
    expect(onToggleDropdown).toHaveBeenCalledWith(true);
  });

  it('calls onSlideSelected with the option value when an option is clicked', async () => {
    const user = userEvent.setup();
    const onSlideSelected = vi.fn();
    render(
      <SlideRefSelector
        {...baseProps}
        isDropdownOpen={true}
        onSlideSelected={onSlideSelected}
      />
    );

    await user.click(screen.getByText('Middle'));
    expect(onSlideSelected).toHaveBeenCalledWith('slide-2');
  });

  it('forwards search input changes to onSearchInputChanged', async () => {
    const user = userEvent.setup();
    const onSearchInputChanged = vi.fn();
    render(
      <SlideRefSelector
        {...baseProps}
        isDropdownOpen={true}
        onSearchInputChanged={onSearchInputChanged}
      />
    );

    await user.type(screen.getByPlaceholderText('Search slides...'), 'a');
    expect(onSearchInputChanged).toHaveBeenCalled();
  });
});
