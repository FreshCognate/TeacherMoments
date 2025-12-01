import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';
import { Scenario } from '~/modules/scenarios/scenarios.types';
import FlatButton from '~/uikit/buttons/components/flatButton';
import Icon from '~/uikit/icons/components/icon';

const CohortScenarioListItem = ({
  scenario,
  isSyncing,
  onRemoveScenarioClicked,
}: { scenario: Scenario, isSyncing: boolean, onRemoveScenarioClicked: (scenarioId: string) => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: scenario._id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    boxShadow: isDragging ? '0 4px 12px rgba(0,0,0,0.08)' : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-lm-1 dark:bg-dm-1 rounded-md p-4 flex items-center group"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab p-2"
      >
        <Icon
          icon="sort"
          size={16}
          className="mr-2"
        />
      </div>
      <div className="flex-1">{scenario.name}</div>
      <FlatButton
        text="Remove"
        className="opacity-0 group-hover:opacity-100"
        isDisabled={isSyncing}
        onClick={() => onRemoveScenarioClicked(scenario._id)}
      />
    </div>
  );
};

export default CohortScenarioListItem;