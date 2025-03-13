import { useDndContext, useDroppable } from '@dnd-kit/core';
import classnames from 'classnames';

const ProjectDropzone = ({
  id,
  data,
  sortOrder,
}) => {

  const dndContext = useDndContext();

  const { isOver, setNodeRef } = useDroppable({
    id, data: {
      ...data,
      sortOrder
    }
  });

  const droppableClassName = classnames("absolute -mt-1 w-full z-20 border-t-2", {
    "border-transparent": !isOver,
    "border-blue-500": isOver,
    "h-4": !!dndContext.active,
    "h-0": !dndContext.active
  })

  return (
    <div ref={setNodeRef} className={droppableClassName}>
      {(isOver) && (
        <div style={{ top: '-4px', left: '-4px' }} className="w-2 z-30 h-2 absolute bg-white border-2 border-blue-500 rounded-md" />
      )}
    </div>
  );
};

export default ProjectDropzone;