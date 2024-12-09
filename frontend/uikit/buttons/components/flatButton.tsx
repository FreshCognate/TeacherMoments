import React from 'react';
import BaseButton from './baseButton';
import classnames from 'classnames';

type Props = {
  id?: string,
  text?: string,
  html?: string,
  title?: string,
  component?: React.ReactNode,
  icon?: string,
  iconSize?: number,
  iconPosition?: string,
  size?: string,
  color?: string,
  className?: string,
  style?: object,
  ariaLabel?: string,
  ariaControls?: string,
  isDisabled?: boolean,
  isCircular?: boolean,
  isFullWidth?: boolean,
  onClick: (params: any) => any
}

export default function FlatButton({
  id,
  text,
  html,
  title,
  component,
  icon,
  iconSize = 16,
  iconPosition,
  size,
  color,
  className,
  style,
  ariaLabel,
  ariaControls,
  isDisabled,
  isCircular,
  isFullWidth,
  onClick
}: Props) {

  const classNames = classnames('text-sm text-black text-opacity-60 hover:text-opacity-100 disabled:hover:text-opacity-60 dark:text-white dark:text-opacity-60 hover:dark:text-opacity-100 disabled:hover:dark:text-opacity-60', {
    'hover:text-primary-regular': (color === 'primary'),
    // '': (color === 'secondary'),
    // '': (color === 'warning')
  }, className)

  if (isCircular && size != 'sm') {
    iconSize = 24;
  }

  return (
    <BaseButton
      id={id}
      text={text}
      html={html}
      title={title}
      component={component}
      icon={icon}
      iconPosition={iconPosition}
      iconSize={iconSize}
      size={size}
      className={classNames}
      style={style}
      ariaLabel={ariaLabel}
      ariaControls={ariaControls}
      isDisabled={isDisabled}
      isCircular={isCircular}
      isFullWidth={isFullWidth}
      onClick={onClick}
    />
  );
}