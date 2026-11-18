import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';

vi.mock('../containers/scenarioSyncStatusContainer', () => ({
  default: () => <div data-testid="sync-stub">sync</div>
}));
vi.mock('../containers/scenarioPublishStatusContainer', () => ({
  default: () => <div data-testid="publish-stub">publish</div>
}));
vi.mock('../containers/scenarioValidationContainer', () => ({
  default: () => <div data-testid="validation-stub">validation</div>
}));

import ScenarioEditor from '../components/scenarioEditor';

const baseProps = {
  scenario: { _id: 'scenario-1', name: 'Onboarding' },
  pathValue: 'create',
  isLoading: false,
  hasNoAccess: false,
  onToggleClicked: () => {}
};

const renderInRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('ScenarioEditor', () => {
  it('renders a Loading spinner when isLoading is true', () => {
    const { container } = renderInRouter(<ScenarioEditor {...baseProps} isLoading={true} />);
    expect(container.querySelector('svg.animate-spin')).toBeInTheDocument();
  });

  it('tells someone who has no access that the scenario is not theirs to edit', () => {
    renderInRouter(<ScenarioEditor {...baseProps} scenario={{}} hasNoAccess={true} />);
    expect(screen.getByText("You don't have access to this scenario.")).toBeInTheDocument();
    expect(
      screen.getByText('Only its authors can edit it. To take it, use the link you were given.')
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Create' })).not.toBeInTheDocument();
    expect(screen.queryByTestId('sync-stub')).not.toBeInTheDocument();
  });

  it('shows the no-access message even while the slides are still loading', () => {
    renderInRouter(<ScenarioEditor {...baseProps} scenario={{}} isLoading={true} hasNoAccess={true} />);
    expect(screen.getByText("You don't have access to this scenario.")).toBeInTheDocument();
  });

  it('renders the breadcrumb with a link to /scenarios and the scenario name', () => {
    renderInRouter(<ScenarioEditor {...baseProps} />);
    const link = screen.getByRole('link', { name: 'Scenarios' });
    expect(link).toHaveAttribute('href', '/scenarios');
    expect(screen.getByText('Onboarding')).toBeInTheDocument();
  });

  it('renders the navigation toggle with all sections', () => {
    renderInRouter(<ScenarioEditor {...baseProps} />);
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Share' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Responses' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument();
  });

  it('fires onToggleClicked with the section value when a section is clicked', async () => {
    const user = userEvent.setup();
    const onToggleClicked = vi.fn();

    renderInRouter(<ScenarioEditor {...baseProps} onToggleClicked={onToggleClicked} />);
    await user.click(screen.getByRole('button', { name: 'Settings' }));

    expect(onToggleClicked).toHaveBeenCalledWith('settings');
  });

  it('renders the sync, validation, and publish status containers', () => {
    renderInRouter(<ScenarioEditor {...baseProps} />);
    expect(screen.getByTestId('sync-stub')).toBeInTheDocument();
    expect(screen.getByTestId('publish-stub')).toBeInTheDocument();
    expect(screen.getByTestId('validation-stub')).toBeInTheDocument();
  });
});
