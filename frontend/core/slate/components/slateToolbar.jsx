import React from 'react';

const SlateToolbar = ({ children }) => {

  return (
    <div className="p-1 bg-lm-1 dark:bg-dm-1 border-t border-x rounded-t-4 border-lm-1 dark:border-dm-1">
      {children}
    </div>
  );
};

export default SlateToolbar;
