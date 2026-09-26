import { CSSProperties, ReactNode } from 'react';

export type BaseButtonProps = {
  id?: string,
  text?: string,
  html?: string,
  title?: string,
  component?: ReactNode,
  icon?: string,
  iconSize?: number,
  iconPosition?: string,
  className?: string,
  style?: CSSProperties,
  ariaLabel?: string,
  ariaControls?: string,
  isDisabled?: boolean,
  isFullWidth?: boolean,
  onClick?: (event: any) => void
};
