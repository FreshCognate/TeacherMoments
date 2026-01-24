import React from 'react';
import CreateNavigationContainer from '../containers/createNavigationContainer';
import CreateWorkspaceContainer from '../containers/createWorkspaceContainer';

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
        style={{ height: 'calc(100vh - 154px', marginTop: '16px' }}
        className=" flex"
      >
        <CreateNavigationContainer />
        <CreateWorkspaceContainer />
      </div>
    </DndContext>
  );
};

export default Create;