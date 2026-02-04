import React, { ReactElement } from 'react';
import BaseButton from './baseButton';
import classnames from 'classnames';

export default function Button({
  text,
  html,
  title,
  component,
  icon,
  iconPosition,
  color,
  className,
  style,
  size,
  isDisabled,
  isFullWidth,
  onClick
}: {
  text?: string,
  html?: string,
  title?: string,
  component?: ReactElement,
  icon?: string,
  iconPosition?: string,
  color?: string,
  className?: string,
  style?: any,
  size?: 'rg',
  isDisabled?: boolean,
  isFullWidth?: boolean,
  onClick: (event: Event) => void
}) {

  const classes = classnames('rounded-md px-4 py-2 transition-colors text-sm', {
    'bg-lm-3/60 dark:bg-dm-3/60': !color,
    'hover:bg-lm-3/30 hover:dark:bg-dm-3/30': !color && !isDisabled,
    'bg-black text-white dark:text-black dark:bg-white': (color === 'primary'),
    'hover:bg-dm-4 hover:dark:bg-lm-3': (color === 'primary') && !isDisabled,
    'bg-lm-2 text-black dark:bg-dm-2 dark:text-white': (color === 'secondary'),
    'hover:bg-lm-3 hover:dark:bg-dm-1': (color === 'secondary') && !isDisabled,
    'bg-warning-regular text-white dark:text-black dark:bg-warning-light': (color === 'warning'),
    'hover:bg-warning-dark hover:dark:bg-warning-regular': (color === 'warning') && !isDisabled
  }, className);

  return (
    <BaseButton
      text={text}
      html={html}
      title={title}
      component={component}
      icon={icon}
      iconPosition={iconPosition}
      iconSize={14}
      color={color}
      className={classes}
      style={style}
      size={size}
      isDisabled={isDisabled}
      isFullWidth={isFullWidth}
      onClick={onClick}
    />
  );
}