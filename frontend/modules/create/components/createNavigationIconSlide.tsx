import React from 'react';
import { Link } from 'react-router';
import Icon from '~/uikit/icons/components/icon';
import classnames from 'classnames';

const CreateNavigationIconSlide = ({
  icon,
  link,
  isSelected = false
}: { icon: string, link: string, isSelected: boolean }) => {
  return (
    <Link to={link} replace
      className={classnames("border w-8 h-8 flex items-center justify-center rounded-md transition-colors", {
        "border-lm-2 dark:border-dm-2 hover:bg-lm-2 dark:hover:bg-dm-2": !isSelected,
        "border-blue-500 dark:border-blue-400": isSelected
      })}
    >
      <Icon icon={icon} size={16} />
    </Link>
  );
};

export default CreateNavigationIconSlide;