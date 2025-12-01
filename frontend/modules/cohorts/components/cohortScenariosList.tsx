import React, { useEffect, useMemo, useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Scenario } from '~/modules/scenarios/scenarios.types';
import CohortScenarioListItem from './cohortScenariosListItem';
import map from 'lodash/map';


const CohortScenariosList = ({
  scenarios,
  isSyncing,
  onDragEnd,
  onRemoveScenarioClicked
}: {
  scenarios: Scenario[],
  isSyncing: boolean,
  onDragEnd: (event: DragEndEvent) => void,
  onRemoveScenarioClicked: (scenarioId: string) => void
}) => {

  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <div className="flex gap-y-2 flex-col">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={map(scenarios, '_id')} strategy={verticalListSortingStrategy}>
          {map(scenarios, (scenario: Scenario) => (
            <CohortScenarioListItem
              key={scenario._id}
              scenario={scenario}
              isSyncing={isSyncing}
              onRemoveScenarioClicked={onRemoveScenarioClicked}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default CohortScenariosList;