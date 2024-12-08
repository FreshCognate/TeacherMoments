import React from 'react';

const SlateToolbar = ({ children }) => {

  return (
    <div className="p-1 bg-lm-0 dark:bg-dm-0 border-t rounded-t border-x rounded-t-4 border-lm-3 dark:border-dm-3">
      {children}
    </div>
  );
};

export default SlateToolbar;
