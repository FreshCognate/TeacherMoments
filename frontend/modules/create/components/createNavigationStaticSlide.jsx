import React from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';
import Icon from '~/uikit/icons/components/icon';

const CreateNavigationStaticSlide = ({
  icon,
  label,
  slideId,
  scenarioId,
  isSelected
}) => {

  const className = classnames(
    "bg-lm-1 dark:bg-dm-2 rounded-md h-8 p-2 gap-x-2 mb-4 border border-lm-3 dark:border-dm-2 flex items-center cursor-pointer hover:border-lm-5 dark:hover:border-dm-4 transition-colors",
    {
      "outline outline-blue-500": isSelected
    }
  );

  return (
    <Link to={`/scenarios/${scenarioId}/create?slide=${slideId}`} replace>
      <div className={className}>
        <Icon icon={icon} size={12} />
        <span className="text-xs text-lm-5 dark:text-dm-5 font-medium">{label}</span>
      </div>
    </Link>
  );
};

export default CreateNavigationStaticSlide;
