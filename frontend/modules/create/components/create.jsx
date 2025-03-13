import React from 'react';
import CreateNavigationContainer from '../containers/createNavigationContainer';
import CreateWorkspaceContainer from '../containers/createWorkspaceContainer';
import CreateSettingsContainer from '../containers/createSettingsContainer';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter
} from '@dnd-kit/core';

const Create = ({
  onDragStart,
  onDragEnd,
  onDragOver,
}) => {

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 2
    },
  });

  const sensors = useSensors(
    pointerSensor
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >

      <div
        id="scenario-builder"
        style={{ height: 'calc(100vh - 68px', marginTop: '28px' }}
        className="bg-lm-2 dark:bg-dm-2 flex"
      >
        <CreateNavigationContainer />
        <CreateWorkspaceContainer />
        <CreateSettingsContainer />
      </div>
    </DndContext>
  );
};

export default Create;