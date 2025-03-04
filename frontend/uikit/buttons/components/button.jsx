import React from 'react';
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
}) {

  const classes = classnames('rounded-md px-4 py-1 transition-colors', {
    'bg-lm-3/60 dark:bg-dm-3/60 hover:bg-lm-3/30 hover:dark:bg-dm-3/30': !color,
    'bg-primary-regular text-white dark:text-black hover:bg-primary-dark dark:bg-primary-light hover:dark:bg-primary-regular': (color === 'primary'),
    'bg-warning-regular text-white dark:text-black hover:bg-warning-dark dark:bg-warning-light hover:dark:bg-warning-regular': (color === 'warning')
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