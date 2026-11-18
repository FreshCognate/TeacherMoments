import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';

vi.mock('~/core/cache/containers/withCache', () => ({
  default: (Component) => Component
}));
vi.mock('~/core/app/components/withRouter', () => ({
  default: (Component) => Component
}));
vi.mock('~/core/sockets/helpers/getSockets', () => ({
  default: async () => ({ on: vi.fn(), off: vi.fn(), emit: vi.fn() })
}));

let capturedProps = null;
vi.mock('../components/scenarioEditor', () => ({
  default: (props) => {
    capturedProps = props;
    return <div data-testid="scenario-editor-stub" />;
  }
}));

import ScenarioEditorContainer from '../containers/scenarioEditorContainer';

const router = {
  params: { id: 'scenario-1' },
  location: { pathname: '/scenarios/scenario-1/create', search: '' },
  navigate: vi.fn()
};

const loadedSlides = { data: [], status: 'success' };

const renderWithScenario = (scenario) => render(
  <ScenarioEditorContainer scenario={scenario} slides={loadedSlides} router={router} />
);

describe('ScenarioEditorContainer', () => {
  beforeEach(() => {
    capturedProps = null;
  });

  it('says there is no access when the server refuses the scenario', () => {
    renderWithScenario({ data: {}, status: 'error', response: { status: 401 } });
    expect(capturedProps.hasNoAccess).toBe(true);
  });

  it('says the same when the scenario does not exist', () => {
    renderWithScenario({ data: {}, status: 'error', response: { status: 404 } });
    expect(capturedProps.hasNoAccess).toBe(true);
  });

  it('does not blame access for a server error', () => {
    renderWithScenario({ data: {}, status: 'error', response: { status: 500 } });
    expect(capturedProps.hasNoAccess).toBe(false);
  });

  it('opens the editor once the scenario loads', () => {
    renderWithScenario({ data: { _id: 'scenario-1', name: 'Onboarding' }, status: 'success' });
    expect(capturedProps.hasNoAccess).toBe(false);
    expect(capturedProps.isLoading).toBe(false);
    expect(capturedProps.pathValue).toBe('create');
  });

  it('keeps the editor open when a later save is refused', () => {
    renderWithScenario({ data: { _id: 'scenario-1', name: 'Onboarding' }, status: 'error', response: { status: 401 } });
    expect(capturedProps.hasNoAccess).toBe(false);
  });

  it('says there is no access when another scenario is still in the cache', () => {
    renderWithScenario({ data: { _id: 'scenario-2', name: 'Second Scenario' }, status: 'error', response: { status: 401 } });
    expect(capturedProps.hasNoAccess).toBe(true);
  });
});
