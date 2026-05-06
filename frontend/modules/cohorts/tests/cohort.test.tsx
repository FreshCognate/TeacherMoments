import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';

vi.mock('../containers/cohortBreadcrumbContainer', () => ({
  default: () => <div data-testid="breadcrumb-stub">breadcrumb</div>
}));

import Cohort from '../components/cohort';

const baseProps = {
  cohort: { _id: 'cohort-1', name: 'Spring Cohort' } as any,
  pathValue: 'overview',
  isLoading: false,
  isEditor: false,
  onToggleClicked: () => {}
};

const renderInRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

describe('Cohort', () => {
  it('renders a Loading spinner when isLoading is true', () => {
    const { container } = renderInRouter(<Cohort {...baseProps} isLoading={true} />);
    expect(container.querySelector('svg.animate-spin')).toBeInTheDocument();
  });

  it('renders the breadcrumb', () => {
    renderInRouter(<Cohort {...baseProps} />);
    expect(screen.getByTestId('breadcrumb-stub')).toBeInTheDocument();
  });

  it('does not render the navigation toggle when the user is not an editor', () => {
    renderInRouter(<Cohort {...baseProps} />);
    expect(screen.queryByRole('button', { name: 'Overview' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Settings' })).not.toBeInTheDocument();
  });

  it('renders the navigation toggle when the user is an editor', () => {
    renderInRouter(<Cohort {...baseProps} isEditor={true} />);
    expect(screen.getByRole('button', { name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Users' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Scenarios' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument();
  });

  it('fires onToggleClicked with the option value when a toggle is clicked', async () => {
    const user = userEvent.setup();
    const onToggleClicked = vi.fn();

    renderInRouter(
      <Cohort {...baseProps} isEditor={true} onToggleClicked={onToggleClicked} />
    );
    await user.click(screen.getByRole('button', { name: 'Settings' }));

    expect(onToggleClicked).toHaveBeenCalledWith('settings');
  });
});
