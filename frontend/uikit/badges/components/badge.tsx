import React from 'react';
import Icon from '~/uikit/icons/components/icon';
import classnames from 'classnames';

const Badge = ({
  icon,
  iconSize,
  text,
  size = "rg",
  color,
  className
}: {
  icon?: string,
  iconSize?: number,
  text?: string,
  size?: string,
  color?: 'warning' | 'primary',
  className?: string
}) => {
  let iconSizeValue = size === 'rg' ? 12 : 16;

  if (iconSize) {
    iconSizeValue = iconSize;
  }

  return (
    <div className={classnames("flex items-center py-micro px-2 rounded-full bg-lm-0/60  dark:bg-dm-0/60",
      "text-black/60 dark:text-white/60",
      className,
      {

        "text-rg": size === 'lg',
        "text-sm": size === 'rg',
        "border-warning-regular dark:border-warning-light text-warning-regular dark:text-warning-light": color === 'warning',
        "border-primary-regular dark:border-primary-light text-primary-regular dark:text-primary-light": color === 'primary'
      })}>
      {(icon) && (
        <Icon icon={icon} color={color} className={classnames("dark:text-white text-1 mr-1", {
          "text-warning-regular dark:text-warning-light": color === 'warning',
          "text-primary-regular dark:text-primary-light": color === 'primary',
        })} size={iconSizeValue} />
      )}
      <span>
        {text}
      </span>
    </div>
  );
};

export default Badge;