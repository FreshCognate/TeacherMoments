import React from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';
import CreateNavigationSlideActionsContainer from '../containers/createNavigationSlideActionsContainer';

const CreateNavigationSlide = ({
  scenarioId,
  slide,
  draggingOptions = {},
  isSelected,
  isDeleting,
  onDeleteSlideClicked
}) => {

  const { setNodeRef, style, attributes, listeners, isDragging } = draggingOptions;

  const className = classnames("bg-lm-2 dark:bg-dm-2 rounded-md h-28 mb-2", {
    "outline outline-blue-500": isSelected,
    "opacity-50": isDeleting,
    "opacity-50": isDragging
  });

  return (
    <Link to={`/scenarios/${scenarioId}/create?slide=${slide._id}`}>
      <div className={className} style={style} ref={setNodeRef} {...listeners} {...attributes}>
        <CreateNavigationSlideActionsContainer
          onDeleteSlideClicked={() => onDeleteSlideClicked(slide._id)}
        />
      </div>
    </Link>
  );
};

export default CreateNavigationSlide;