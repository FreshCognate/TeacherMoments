import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('../containers/cohortScenariosListContainer', () => ({
  default: () => <div data-testid="scenarios-list-stub">scenarios list</div>
}));

import CohortScenarios from '../components/cohortScenarios';

const baseProps = {
  availableScenarios: [
    { _id: 'scenario-1', name: 'Onboarding' },
    { _id: 'scenario-2', name: 'Compliance' }
  ] as any,
  availableScenariosSearchValue: '',
  availableScenariosCurrentPage: 1,
  availableScenariosTotalPages: 1,
  availableScenariosIsLoading: false,
  availableScenariosIsSyncing: false,
  getItemAttributes: (item: any) => ({ id: item._id, name: item.name }),
  getAvailableScenariosItemActions: () => [{ action: 'ADD', text: 'Add' }],
  getAvailableScenariosEmptyAttributes: () => ({
    title: 'Nothing here',
    body: 'Try a different search'
  }),
  onAvailableScenariosSearchValueChange: () => {},
  onAvailableScenariosPaginationClicked: () => {},
  onAvailableScenariosItemActionClicked: () => {},
  onAvailableScenariosEmptyActionClicked: () => {}
};

describe('CohortScenarios', () => {
  it('renders the in-cohort scenarios list container', () => {
    render(<CohortScenarios {...baseProps} />);
    expect(screen.getByTestId('scenarios-list-stub')).toBeInTheDocument();
  });

  it('renders the section titles', () => {
    render(<CohortScenarios {...baseProps} />);
    expect(screen.getByText('Scenarios in this Cohort')).toBeInTheDocument();
    expect(screen.getByText('Available scenarios')).toBeInTheDocument();
  });

  it('renders an entry for each available scenario', () => {
    render(<CohortScenarios {...baseProps} />);
    expect(screen.getByText('Onboarding')).toBeInTheDocument();
    expect(screen.getByText('Compliance')).toBeInTheDocument();
  });

  it('fires onAvailableScenariosSearchValueChange when the user types in the search box', async () => {
    const user = userEvent.setup();
    const onAvailableScenariosSearchValueChange = vi.fn();

    render(
      <CohortScenarios
        {...baseProps}
        onAvailableScenariosSearchValueChange={onAvailableScenariosSearchValueChange}
      />
    );

    const search = screen.getByPlaceholderText('Search scenarios...');
    await user.type(search, 'X');

    expect(onAvailableScenariosSearchValueChange).toHaveBeenCalledWith('X');
  });
});
