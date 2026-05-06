import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AnalyticsScenarioResponsesSummary from './analyticsScenarioResponsesSummary';

const summary = {
  overview: 'Overall the cohort engaged well',
  sections: [
    { title: 'Strengths', content: 'Strong critical thinking' },
    { title: 'Areas to improve', content: 'Time management' }
  ],
  summary: 'Net positive engagement'
};

describe('AnalyticsScenarioResponsesSummary', () => {
  it('renders the scenario name when provided', () => {
    render(
      <AnalyticsScenarioResponsesSummary
        scenarioName="Onboarding"
        summaryData={summary}
        isLoading={false}
      />
    );
    expect(screen.getByText('Scenario: Onboarding')).toBeInTheDocument();
  });

  it('renders a Loading spinner when isLoading is true', () => {
    const { container } = render(
      <AnalyticsScenarioResponsesSummary
        summaryData={null}
        isLoading={true}
      />
    );
    expect(container.querySelector('svg.animate-spin')).toBeInTheDocument();
  });

  it('renders overview, all section titles + content, and summary', () => {
    render(
      <AnalyticsScenarioResponsesSummary
        scenarioName="Onboarding"
        summaryData={summary}
        isLoading={false}
      />
    );

    expect(screen.getByText('Overall the cohort engaged well')).toBeInTheDocument();
    expect(screen.getByText('Strengths')).toBeInTheDocument();
    expect(screen.getByText('Strong critical thinking')).toBeInTheDocument();
    expect(screen.getByText('Areas to improve')).toBeInTheDocument();
    expect(screen.getByText('Time management')).toBeInTheDocument();
    expect(screen.getByText('Net positive engagement')).toBeInTheDocument();
  });

  it('does not render the Key findings heading when there are no sections', () => {
    render(
      <AnalyticsScenarioResponsesSummary
        scenarioName="Onboarding"
        summaryData={{ ...summary, sections: [] }}
        isLoading={false}
      />
    );
    expect(screen.queryByText('Key findings')).not.toBeInTheDocument();
  });
});
