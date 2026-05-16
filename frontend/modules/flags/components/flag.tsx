import React, { ReactNode } from 'react';
import hasFlag from '../helpers/hasFlag';

const Flag = ({
  children,
}: {
  children: ReactNode;
}) => {
  if (hasFlag()) {
    return children;
  }
  return null;
};

export default Flag;