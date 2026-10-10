import React from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';
import Icon from '~/uikit/icons/components/icon';

const TRANSITION = { duration: 0.25, ease: 'easeInOut' };

const CreateNavigationStaticSlide = ({
  icon,
  label,
  slideId,
  scenarioId,
  isSelected,
}) => {

  const previewClassName = classnames(
    "bg-lm-1 dark:bg-dm-2 rounded-md h-8 p-2 mb-4 flex items-center border border-lm-3 dark:border-dm-2 cursor-pointer hover:border-lm-5 dark:hover:border-dm-4 transition-colors",
    {
      "outline outline-blue-500": isSelected
    }
  );

  return (
    <Link to={`/scenarios/${scenarioId}/create?slide=${slideId}`} replace className={previewClassName}>
      <div className="flex gap-x-2 items-center">
        <Icon icon={icon} size={12} />
        <div
          className="text-xs text-lm-5 dark:text-dm-5 font-medium"
        >
          {label}
        </div>

      </div>
    </Link>
  );
};

export default CreateNavigationStaticSlide;
