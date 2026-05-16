import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ScenarioSyncStatus from '../components/scenarioSyncStatus';

describe('ScenarioSyncStatus', () => {
  it('renders nothing when neither isSyncing nor hasSynced is true', () => {
    const { container } = render(
      <ScenarioSyncStatus syncType="scenario" isSyncing={false} hasSynced={false} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders the syncing indicator and label when isSyncing is true', () => {
    render(<ScenarioSyncStatus syncType="scenario" isSyncing={true} hasSynced={false} />);
    expect(screen.getByText('Syncing scenario')).toBeInTheDocument();
  });

  it('renders the saved indicator when hasSynced is true', () => {
    render(<ScenarioSyncStatus syncType="scenario" isSyncing={false} hasSynced={true} />);
    expect(screen.getByText('Changes saved')).toBeInTheDocument();
  });
});
