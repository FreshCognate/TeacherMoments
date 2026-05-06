import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ScenarioCollaborators from '../components/scenarioCollaborators';

const baseProps = {
  collaborators: [
    { _id: 'user-1', firstName: 'Alex', lastName: 'Doe' },
    { _id: 'user-2', firstName: 'Jamie', lastName: 'Smith' }
  ],
  getItemAttributes: (item) => ({
    id: item._id,
    name: `${item.firstName} ${item.lastName}`
  }),
  getItemActions: () => [{ action: 'REMOVE', text: 'Remove' }],
  actions: [{ action: 'ADD', text: 'Add collaborator' }],
  isSyncing: false,
  onActionClicked: () => {},
  onItemActionClicked: () => {}
};

describe('ScenarioCollaborators', () => {
  it('renders one row per collaborator', () => {
    render(<ScenarioCollaborators {...baseProps} />);
    expect(screen.getByText('Alex Doe')).toBeInTheDocument();
    expect(screen.getByText('Jamie Smith')).toBeInTheDocument();
  });

  it('fires onActionClicked when the top-level Add collaborator action is clicked', async () => {
    const user = userEvent.setup();
    const onActionClicked = vi.fn();

    render(<ScenarioCollaborators {...baseProps} onActionClicked={onActionClicked} />);
    await user.click(screen.getByRole('button', { name: 'Add collaborator' }));

    expect(onActionClicked).toHaveBeenCalledWith({ action: 'ADD' });
  });
});
