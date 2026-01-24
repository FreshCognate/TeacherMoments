import React from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';

const CreateNavigationStaticSlide = ({
  label,
  slideId,
  scenarioId,
  isSelected
}) => {

  const className = classnames(
    "bg-lm-1 dark:bg-dm-2 rounded-md h-8 mb-2 border border-dashed border-lm-4 dark:border-dm-3 flex items-center justify-center cursor-pointer hover:border-lm-5 dark:hover:border-dm-4 transition-colors",
    {
      "outline outline-blue-500": isSelected
    }
  );

  return (
    <Link to={`/scenarios/${scenarioId}/create?slide=${slideId}`} replace>
      <div className={className}>
        <span className="text-xs text-lm-5 dark:text-dm-5 font-medium">{label}</span>
      </div>
    </Link>
  );
};

export default CreateNavigationStaticSlide;
