import React from 'react';

const SlateToolbar = ({ children }) => {

  return (
    <div className="p-1 bg-lm-3/50 dark:bg-dm-3/50  rounded-t rounded-t-4">
      {children}
    </div>
  );
};

export default SlateToolbar;
