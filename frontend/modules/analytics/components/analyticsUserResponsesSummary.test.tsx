import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AnalyticsUserResponsesSummary from './analyticsUserResponsesSummary';

const summary = {
  overview: 'User engagement was high',
  sections: [{ title: 'Highlights', content: 'Insightful answers' }],
  summary: 'Solid overall performance'
};

describe('AnalyticsUserResponsesSummary', () => {
  it('renders the user header', () => {
    render(
      <AnalyticsUserResponsesSummary
        userName="Alex"
        summaryData={summary}
        isLoading={false}
      />
    );
    expect(screen.getByText('User: Alex')).toBeInTheDocument();
  });

  it('renders the scenario subtitle when provided', () => {
    render(
      <AnalyticsUserResponsesSummary
        userName="Alex"
        scenarioName="Onboarding"
        summaryData={summary}
        isLoading={false}
      />
    );
    expect(screen.getByText('Onboarding')).toBeInTheDocument();
  });

  it('renders a Loading spinner when isLoading is true', () => {
    const { container } = render(
      <AnalyticsUserResponsesSummary
        userName="Alex"
        summaryData={null}
        isLoading={true}
      />
    );
    expect(container.querySelector('svg.animate-spin')).toBeInTheDocument();
  });

  it('renders overview, sections, and summary when summaryData is provided', () => {
    render(
      <AnalyticsUserResponsesSummary
        userName="Alex"
        summaryData={summary}
        isLoading={false}
      />
    );
    expect(screen.getByText('User engagement was high')).toBeInTheDocument();
    expect(screen.getByText('Highlights')).toBeInTheDocument();
    expect(screen.getByText('Insightful answers')).toBeInTheDocument();
    expect(screen.getByText('Solid overall performance')).toBeInTheDocument();
  });
});
