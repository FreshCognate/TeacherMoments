import React from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';

const CreateNavigationSlide = ({
  scenarioId,
  slide,
  isSelected
}) => {

  const className = classnames("bg-lm-2 dark:bg-dm-2 rounded-md h-28 mb-2", {
    "outline outline-blue-500": isSelected
  });

  return (
    <Link to={`/scenarios/${scenarioId}/create?slide=${slide._id}`}>
      <div className={className}>
      </div>
    </Link>
  );
};

export default CreateNavigationSlide;