import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';
import { Scenario } from '~/modules/scenarios/scenarios.types';
import Button from '~/uikit/buttons/components/button';
import FlatButton from '~/uikit/buttons/components/flatButton';
import Icon from '~/uikit/icons/components/icon';

const CohortScenarioListItem = ({
  scenario,
  isSyncing,
  onRemoveScenarioClicked,
  onViewResponsesClicked,
}: { scenario: Scenario, isSyncing: boolean, onRemoveScenarioClicked: (scenarioId: string) => void, onViewResponsesClicked: (scenarioId: string) => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: scenario._id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    boxShadow: isDragging ? '0 4px 12px rgba(0,0,0,0.08)' : undefined,
    zIndex: isDragging ? 10 : 0
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-lm-2 dark:bg-dm-2 rounded-md p-4 group"
    >
      <div className="flex items-center">
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
      <div className="mt-2 pl-10">
        <Button
          icon="responses"
          text="View responses"
          onClick={() => onViewResponsesClicked(scenario._id)}
        />
      </div>
    </div>
  );
};

export default CohortScenarioListItem;