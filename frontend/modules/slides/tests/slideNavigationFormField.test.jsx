import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('~/uikit/buttons/components/flatButton', () => ({
  default: ({ icon, onClick }) => (
    <button onClick={onClick} aria-label={icon} data-icon={icon} />
  )
}));

vi.mock('~/uikit/content/components/body', () => ({
  default: ({ body }) => <span data-body>{body}</span>
}));

import SlideNavigationFormField from '../components/slideNavigation.formField';

const schema = {
  options: [
    { value: 'next', text: 'Continue', description: 'Go to the next slide' },
    { value: 'end', text: 'End', description: 'Stop the scenario' },
    { value: 'restart', text: 'Restart', description: 'Start the scenario over' }
  ]
};

const baseProps = {
  value: 'next',
  schema,
  isEditing: false,
  onEditClicked: vi.fn(),
  onNavigationOptionClicked: vi.fn()
};

describe('SlideNavigationFormField', () => {
  it('shows the selected option text', () => {
    render(<SlideNavigationFormField {...baseProps} />);
    expect(screen.getByText('Continue')).toBeInTheDocument();
  });

  it('renders an edit icon when not editing', () => {
    render(<SlideNavigationFormField {...baseProps} />);
    expect(screen.getByLabelText('edit')).toBeInTheDocument();
    expect(screen.queryByLabelText('done')).not.toBeInTheDocument();
  });

  it('renders a done icon and the description when editing', () => {
    render(<SlideNavigationFormField {...baseProps} isEditing={true} />);
    expect(screen.getByLabelText('done')).toBeInTheDocument();
    expect(screen.getByText('Go to the next slide')).toBeInTheDocument();
  });

  it('does not render other options when not editing', () => {
    render(<SlideNavigationFormField {...baseProps} />);
    expect(screen.queryByText('End')).not.toBeInTheDocument();
    expect(screen.queryByText('Restart')).not.toBeInTheDocument();
  });

  it('renders the other options excluding the selected one when editing', () => {
    render(<SlideNavigationFormField {...baseProps} isEditing={true} />);
    expect(screen.getByText('End')).toBeInTheDocument();
    expect(screen.getByText('Restart')).toBeInTheDocument();
    expect(screen.getAllByText('Continue')).toHaveLength(1);
  });

  it('calls onEditClicked when the edit/done icon is pressed', async () => {
    const user = userEvent.setup();
    const onEditClicked = vi.fn();
    render(<SlideNavigationFormField {...baseProps} onEditClicked={onEditClicked} />);
    await user.click(screen.getByLabelText('edit'));
    expect(onEditClicked).toHaveBeenCalledTimes(1);
  });

  it('calls onNavigationOptionClicked with the option value when an option is clicked', async () => {
    const user = userEvent.setup();
    const onNavigationOptionClicked = vi.fn();
    render(
      <SlideNavigationFormField
        {...baseProps}
        isEditing={true}
        onNavigationOptionClicked={onNavigationOptionClicked}
      />
    );

    await user.click(screen.getByText('End'));
    expect(onNavigationOptionClicked).toHaveBeenCalledWith('end');
  });
});
