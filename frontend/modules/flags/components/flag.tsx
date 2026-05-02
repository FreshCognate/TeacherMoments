import includes from 'lodash/includes';
import React, { ReactNode } from 'react';

const Flag = ({
  children,
}: {
  children: ReactNode;
}) => {
  if (includes(['mit-tm.com', 'staging.teachermoments.org'], window.location.hostname)) {
    return children;
  }
  return null;
};

export default Flag;