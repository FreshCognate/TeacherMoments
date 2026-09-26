import { ReactNode } from 'react';

export type DropdownOption = {
  value?: any;
  action?: string;
  text?: string;
  separator?: boolean;
};

export type DropdownProps = {
  children?: ReactNode;
  options?: DropdownOption[];
  placeholder?: string;
  position?: 'left' | 'right';
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  onOptionClicked: (value: any) => void;
};
