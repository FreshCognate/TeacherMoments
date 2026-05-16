import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CohortScenariosList from '../components/cohortScenariosList';

const baseProps = {
  isSyncing: false,
  onDragEnd: () => {},
  onRemoveScenarioClicked: () => {},
  onViewResponsesClicked: () => {},
  onExportClicked: () => {}
};

const scenarios = [
  { _id: 'scenario-1', name: 'Onboarding' },
  { _id: 'scenario-2', name: 'Compliance Training' }
] as any;

describe('CohortScenariosList', () => {
  it('renders the empty state when there are no scenarios', () => {
    render(<CohortScenariosList {...baseProps} scenarios={[]} />);
    expect(
      screen.getByText('No Scenarios have been added to this Cohort')
    ).toBeInTheDocument();
  });

  it('does not render the Export button when there are no scenarios', () => {
    render(<CohortScenariosList {...baseProps} scenarios={[]} />);
    expect(
      screen.queryByRole('button', { name: 'Export CSV' })
    ).not.toBeInTheDocument();
  });

  it('renders the Export button when scenarios exist', () => {
    render(<CohortScenariosList {...baseProps} scenarios={scenarios} />);
    expect(
      screen.getByRole('button', { name: 'Export CSV' })
    ).toBeInTheDocument();
  });

  it('renders one row per scenario', () => {
    render(<CohortScenariosList {...baseProps} scenarios={scenarios} />);
    expect(screen.getByText('Onboarding')).toBeInTheDocument();
    expect(screen.getByText('Compliance Training')).toBeInTheDocument();
  });

  it('fires onExportClicked when the Export button is clicked', async () => {
    const user = userEvent.setup();
    const onExportClicked = vi.fn();

    render(
      <CohortScenariosList
        {...baseProps}
        scenarios={scenarios}
        onExportClicked={onExportClicked}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Export CSV' }));

    expect(onExportClicked).toHaveBeenCalledTimes(1);
  });
});
