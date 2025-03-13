import React from "react";
import { useDraggable } from "@dnd-kit/core";
import CreateDropzone from "./createDropzone";

const SortableItem = ({ id, renderItem, items, item, index, droppableIndex, data }) => {

  const draggableProps = useDraggable({
    id: item._id,
    data: {
      ...data,
      sortOrder: index
    }
  });


  const {
    attributes,
    listeners,
    setNodeRef,
    transition,
    isDragging,
  } = draggableProps;

  const style = {
    transform: null,
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <>
      {renderItem({ items, item, index, draggingOptions: { style, attributes, setNodeRef, listeners, isDragging } })}
      {(!isDragging) && (
        <CreateDropzone
          id={item._id}
          data={data}
          sortOrder={index + 1}
        />
      )}
    </>
  );
};

export default SortableItem;