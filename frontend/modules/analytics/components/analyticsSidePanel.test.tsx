import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('../containers/analyticsSlideViewerContainer', () => ({
  default: () => <div data-testid="slide-viewer">slide viewer</div>
}));

import AnalyticsSidePanel from './analyticsSidePanel';

const baseProps = {
  viewType: 'byScenarioUsers' as const,
  selectedResponse: null,
  selectedBlockResponseRef: null,
  selectedSlideRef: null,
  onSlideNavigated: () => {},
  onBlockNavigated: () => {},
  onClose: () => {}
};

const userResponse = {
  user: { firstName: 'Alex', lastName: 'Doe' },
  scenario: { name: 'Onboarding' }
};

describe('AnalyticsSidePanel', () => {
  it('renders the empty state when no response is selected', () => {
    render(<AnalyticsSidePanel {...baseProps} />);
    expect(screen.getByText('No response selected')).toBeInTheDocument();
    expect(screen.queryByTestId('slide-viewer')).not.toBeInTheDocument();
  });

  it('renders the selected user title and the slide viewer when a response is selected (byScenarioUsers)', () => {
    render(<AnalyticsSidePanel {...baseProps} selectedResponse={userResponse} />);
    expect(screen.getByText(/Alex/)).toBeInTheDocument();
    expect(screen.getByTestId('slide-viewer')).toBeInTheDocument();
  });

  it('renders the scenario name as title when viewType is byUserScenarios', () => {
    render(
      <AnalyticsSidePanel
        {...baseProps}
        viewType="byUserScenarios"
        selectedResponse={userResponse}
      />
    );
    expect(screen.getByText('Onboarding')).toBeInTheDocument();
  });

  it('fires onClose when the close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<AnalyticsSidePanel {...baseProps} selectedResponse={userResponse} onClose={onClose} />);
    await user.click(screen.getByRole('button'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders previous/next user buttons when onUserNavigated is provided in byScenarioUsers view', async () => {
    const user = userEvent.setup();
    const onUserNavigated = vi.fn();

    render(
      <AnalyticsSidePanel
        {...baseProps}
        selectedResponse={userResponse}
        onUserNavigated={onUserNavigated}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Previous user' }));
    expect(onUserNavigated).toHaveBeenCalledWith('up');

    await user.click(screen.getByRole('button', { name: 'Next user' }));
    expect(onUserNavigated).toHaveBeenCalledWith('down');
  });

  it('does not render previous/next user buttons in byUserScenarios view', () => {
    render(
      <AnalyticsSidePanel
        {...baseProps}
        viewType="byUserScenarios"
        selectedResponse={userResponse}
        onUserNavigated={() => {}}
      />
    );
    expect(screen.queryByRole('button', { name: 'Previous user' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Next user' })).not.toBeInTheDocument();
  });
});
