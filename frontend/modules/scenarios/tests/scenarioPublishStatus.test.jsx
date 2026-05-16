import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import ScenarioPublishStatus from '../components/scenarioPublishStatus';

const renderInRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('ScenarioPublishStatus', () => {
  it('renders nothing when there are no unpublished changes', () => {
    const { container } = renderInRouter(
      <ScenarioPublishStatus scenarioId="scenario-1" hasChanges={false} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders an "Unpublished changes" link to the share page when hasChanges is true', () => {
    renderInRouter(
      <ScenarioPublishStatus scenarioId="scenario-1" hasChanges={true} />
    );
    const link = screen.getByRole('link', { name: 'Unpublished changes' });
    expect(link).toHaveAttribute('href', '/scenarios/scenario-1/share');
  });
});
