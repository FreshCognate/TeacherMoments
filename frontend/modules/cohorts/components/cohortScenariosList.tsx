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
import Title from '~/uikit/content/components/title';
import Body from '~/uikit/content/components/body';


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
      {(scenarios?.length === 0) && (
        <div className="text-center py-8 px-6 border border-lm-1 dark:border-dm-1 rounded-xl bg-lm-1 dark:bg-dm-1">
          <div className="max-w-md mx-auto">
            <Title title="No Scenarios have been added to this Cohort" size='xl' className="mb-4" />
            <Body body="Search and find Scenarios in the list opposite and click 'Add' to add a Scenario to this Cohort." size='sm' className="text-white/50" />
          </div>
        </div>
      )}
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