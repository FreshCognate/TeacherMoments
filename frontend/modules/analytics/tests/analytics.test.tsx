import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('~/uikit/actionBars/components/actionBar', () => ({
  default: () => <div data-testid="action-bar" />
}));
vi.mock('../components/analyticsResponses', () => ({
  default: () => <div data-testid="analytics-responses" />
}));
vi.mock('../containers/analyticsResponsesTableContainer', () => ({
  default: () => <div data-testid="analytics-responses-table" />
}));
vi.mock('../components/analyticsSidePanel', () => ({
  default: () => <div data-testid="analytics-side-panel" />
}));

import Analytics from '../components/analytics';

const baseProps = {
  viewType: 'byUserScenarios' as const,
  responses: [],
  selectedResponse: null,
  selectedBlockResponseRef: null,
  selectedSlideRef: null,
  isLoading: false,
  onResponseClicked: () => {},
  onSlideNavigated: () => {},
  onBlockNavigated: () => {},
  onSidePanelClose: () => {},
  onSummarizeSlide: () => {},
  onSummarizeScenario: () => {},
  onSummarizeUser: () => {}
};

describe('Analytics', () => {
  it('shows the line it is given when there are no responses', () => {
    render(<Analytics {...baseProps} emptyBody="Scenarios you take appear here." />);
    expect(screen.getByText('No responses')).toBeInTheDocument();
    expect(screen.getByText('Scenarios you take appear here.')).toBeInTheDocument();
  });

  it("falls back to the Responses tab's line when none is given", () => {
    render(<Analytics {...baseProps} viewType="byScenarioUsers" />);
    expect(screen.getByText('Responses appear here once participants take this scenario.')).toBeInTheDocument();
  });
});
