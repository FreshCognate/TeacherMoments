import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CohortCompletionStats from '../components/cohortCompletionStats';

describe('CohortCompletionStats', () => {
  it('renders a Loading spinner when isLoading is true', () => {
    const { container } = render(
      <CohortCompletionStats
        totalUsers={10}
        cohortCompletionCount={3}
        isLoading={true}
      />
    );
    expect(container.querySelector('svg.animate-spin')).toBeInTheDocument();
  });

  it('renders the completion count and total users text when not loading', () => {
    render(
      <CohortCompletionStats
        totalUsers={10}
        cohortCompletionCount={3}
        isLoading={false}
      />
    );
    expect(
      screen.getByText('3 / 10 users have completed all scenarios')
    ).toBeInTheDocument();
  });
});
