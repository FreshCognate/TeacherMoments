import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('~/core/forms/containers/formContainer', () => ({
  default: () => <div data-testid="form-stub">form</div>
}));
vi.mock('../containers/scenarioCollaboratorsContainer', () => ({
  default: () => <div data-testid="collaborators-stub">collaborators</div>
}));

import ScenarioSettings from '../components/scenarioSettings';

const baseProps = {
  schema: {},
  scenario: { _id: 'scenario-1', name: 'Onboarding' },
  isLoading: false,
  onUpdateScenario: () => {},
  onDeleteScenarioClicked: () => {}
};

describe('ScenarioSettings', () => {
  it('renders nothing when isLoading is true', () => {
    const { container } = render(<ScenarioSettings {...baseProps} isLoading={true} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the settings title, the form, and the delete button when not loading', () => {
    render(<ScenarioSettings {...baseProps} />);
    expect(screen.getByText('Scenario settings')).toBeInTheDocument();
    expect(screen.getByTestId('form-stub')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete scenario' })).toBeInTheDocument();
  });

  it('renders the collaborators title and container', () => {
    render(<ScenarioSettings {...baseProps} />);
    expect(screen.getByText('Collaborators')).toBeInTheDocument();
    expect(screen.getByTestId('collaborators-stub')).toBeInTheDocument();
  });

  it('fires onDeleteScenarioClicked when the delete button is clicked', async () => {
    const user = userEvent.setup();
    const onDeleteScenarioClicked = vi.fn();

    render(<ScenarioSettings {...baseProps} onDeleteScenarioClicked={onDeleteScenarioClicked} />);
    await user.click(screen.getByRole('button', { name: 'Delete scenario' }));

    expect(onDeleteScenarioClicked).toHaveBeenCalledTimes(1);
  });
});
