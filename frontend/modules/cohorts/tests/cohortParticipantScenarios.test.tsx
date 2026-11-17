import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('../components/cohortParticipantScenariosItem', () => ({
  default: ({ scenario, run, completedCount, totalUsers }: any) => (
    <div data-testid="scenario-item">
      <span>{scenario.name}</span>
      <span>run:{run ? 'present' : 'absent'}</span>
      <span>completed:{completedCount ?? 'none'}/{totalUsers ?? 'none'}</span>
    </div>
  )
}));

import CohortParticipantScenarios from '../components/cohortParticipantScenarios';

const scenarios = [
  { _id: 'scenario-1', name: 'Onboarding' },
  { _id: 'scenario-2', name: 'Compliance' }
] as any;

const baseProps = {
  scenarios,
  runs: { 'scenario-1': { isComplete: true } } as any,
  scenarioCompletions: [
    { scenarioId: 'scenario-1', completedCount: 5 }
  ],
  totalUsers: 10,
  onPlayScenarioClicked: () => {},
  onViewScenarioResponseClicked: () => {}
};

describe('CohortParticipantScenarios', () => {
  it('renders one item per scenario', () => {
    render(<CohortParticipantScenarios {...baseProps} />);
    expect(screen.getAllByTestId('scenario-item')).toHaveLength(2);
    expect(screen.getByText('Onboarding')).toBeInTheDocument();
    expect(screen.getByText('Compliance')).toBeInTheDocument();
  });

  it('threads the run for each scenario based on its id', () => {
    render(<CohortParticipantScenarios {...baseProps} />);
    expect(screen.getByText('run:present')).toBeInTheDocument();
    expect(screen.getByText('run:absent')).toBeInTheDocument();
  });

  it('threads the matched completion count and totalUsers', () => {
    render(<CohortParticipantScenarios {...baseProps} />);
    expect(screen.getByText('completed:5/10')).toBeInTheDocument();
    expect(screen.getByText('completed:none/10')).toBeInTheDocument();
  });
});

describe('CohortParticipantScenarios with no scenarios', () => {
  it('tells a cohort editor to add scenarios on the Scenarios tab', () => {
    render(<CohortParticipantScenarios {...baseProps} scenarios={[]} isLoading={false} isCohortEditor />);
    expect(screen.getByText('No scenarios in this cohort yet.')).toBeInTheDocument();
    expect(screen.getByText('Add some on the Scenarios tab.')).toBeInTheDocument();
  });

  it('tells a participant their facilitator will add scenarios', () => {
    render(<CohortParticipantScenarios {...baseProps} scenarios={[]} isLoading={false} isCohortEditor={false} />);
    expect(screen.getByText('No scenarios here yet.')).toBeInTheDocument();
    expect(screen.getByText('Your facilitator will add them.')).toBeInTheDocument();
  });

  it('shows no message while the scenarios load', () => {
    render(<CohortParticipantScenarios {...baseProps} scenarios={[]} isLoading />);
    expect(screen.queryByText('No scenarios here yet.')).not.toBeInTheDocument();
    expect(screen.queryByText('No scenarios in this cohort yet.')).not.toBeInTheDocument();
  });
});
