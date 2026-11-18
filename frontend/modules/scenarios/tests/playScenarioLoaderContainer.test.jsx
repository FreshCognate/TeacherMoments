import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('~/core/cache/containers/withCache', () => ({
  default: (Component) => Component
}));
vi.mock('~/core/app/components/withRouter', () => ({
  default: (Component) => Component
}));
vi.mock('../containers/playScenarioContainer', () => ({
  default: () => <div data-testid="player-stub" />
}));

import PlayScenarioLoaderContainer from '../containers/playScenarioLoaderContainer';

const waiting = { data: undefined, status: 'unresolved' };
const loaded = { data: [], status: 'success' };

const renderLoader = ({ scenario, others = waiting }) => render(
  <PlayScenarioLoaderContainer
    scenario={scenario}
    slides={others}
    blocks={others}
    stems={others}
    run={others}
  />
);

describe('PlayScenarioLoaderContainer', () => {
  it('says the link does not work when no published scenario has it', () => {
    renderLoader({ scenario: { data: undefined, status: 'error', response: { status: 404 } } });
    expect(screen.getByText("This scenario link doesn't work.")).toBeInTheDocument();
    expect(screen.getByText('Check the link, or ask your facilitator for a new one.')).toBeInTheDocument();
  });

  it('shows the loader while the scenario loads', () => {
    const { container } = renderLoader({ scenario: { data: undefined, status: 'loading' } });
    expect(container.querySelector('svg.animate-spin')).toBeInTheDocument();
    expect(screen.queryByText("This scenario link doesn't work.")).not.toBeInTheDocument();
  });

  it('opens the player once everything has loaded', () => {
    renderLoader({ scenario: { data: { _id: 'scenario-1' }, status: 'success' }, others: loaded });
    expect(screen.getByTestId('player-stub')).toBeInTheDocument();
  });
});
