import React from 'react';
import BaseButton from './baseButton';
import classnames from 'classnames';

export default function ToolbarButton({
  id,
  text,
  html,
  title,
  component,
  icon,
  iconPosition,
  color,
  className,
  style,
  isDisabled,
  isCircular,
  isFullWidth,
  onClick
}) {

  const classNames = classnames('', {
    '': (color === 'primary'),
    '': (color === 'secondary'),
    '': (color === 'warning')
  }, className);

  return (
    <BaseButton
      id={id}
      text={text}
      html={html}
      title={title}
      component={component}
      icon={icon}
      iconPosition={iconPosition}
      iconSize={20}
      color={color}
      className={classNames}
      style={style}
      isDisabled={isDisabled}
      isCircular={isCircular}
      isFullWidth={isFullWidth}
      onClick={onClick}
    />
  );
}