import React from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';
import CreateNavigationSlideActionsContainer from '../containers/createNavigationSlideActionsContainer';

const CreateNavigationSlide = ({
  scenarioId,
  slide,
  isSelected,
  isDeleting,
  onDeleteSlideClicked
}) => {

  const className = classnames("bg-lm-2 dark:bg-dm-2 rounded-md h-28 mb-2", {
    "outline outline-blue-500": isSelected,
    "opacity-50": isDeleting
  });

  return (
    <Link to={`/scenarios/${scenarioId}/create?slide=${slide._id}`}>
      <div className={className}>
        <CreateNavigationSlideActionsContainer
          onDeleteSlideClicked={() => onDeleteSlideClicked(slide._id)}
        />
      </div>
    </Link>
  );
};

export default CreateNavigationSlide;