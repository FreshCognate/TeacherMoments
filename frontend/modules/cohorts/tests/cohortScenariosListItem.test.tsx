import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DndContext } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import CohortScenariosListItem from '../components/cohortScenariosListItem';

const scenario = { _id: 'scenario-1', name: 'Onboarding' } as any;

const renderInSortableContext = (ui: React.ReactElement) =>
  render(
    <DndContext>
      <SortableContext items={[scenario._id]}>{ui}</SortableContext>
    </DndContext>
  );

describe('CohortScenariosListItem', () => {
  it('renders the scenario name', () => {
    renderInSortableContext(
      <CohortScenariosListItem
        scenario={scenario}
        isSyncing={false}
        onRemoveScenarioClicked={() => {}}
        onViewResponsesClicked={() => {}}
      />
    );
    expect(screen.getByText('Onboarding')).toBeInTheDocument();
  });

  it('fires onRemoveScenarioClicked with the scenario id when Remove is clicked', async () => {
    const user = userEvent.setup();
    const onRemoveScenarioClicked = vi.fn();

    renderInSortableContext(
      <CohortScenariosListItem
        scenario={scenario}
        isSyncing={false}
        onRemoveScenarioClicked={onRemoveScenarioClicked}
        onViewResponsesClicked={() => {}}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Remove' }));
    expect(onRemoveScenarioClicked).toHaveBeenCalledWith('scenario-1');
  });

  it('fires onViewResponsesClicked with the scenario id when View responses is clicked', async () => {
    const user = userEvent.setup();
    const onViewResponsesClicked = vi.fn();

    renderInSortableContext(
      <CohortScenariosListItem
        scenario={scenario}
        isSyncing={false}
        onRemoveScenarioClicked={() => {}}
        onViewResponsesClicked={onViewResponsesClicked}
      />
    );

    await user.click(screen.getByRole('button', { name: /View responses/ }));
    expect(onViewResponsesClicked).toHaveBeenCalledWith('scenario-1');
  });

  it('disables the Remove button when isSyncing is true', () => {
    renderInSortableContext(
      <CohortScenariosListItem
        scenario={scenario}
        isSyncing={true}
        onRemoveScenarioClicked={() => {}}
        onViewResponsesClicked={() => {}}
      />
    );
    expect(screen.getByRole('button', { name: 'Remove' })).toBeDisabled();
  });
});
