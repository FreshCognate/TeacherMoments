import React from 'react';

const CardActions = ({
  children
}) => {
  if (!children) return null;
  console.log(children);
  return (
    <div className="px-4 py-2 border-t border-t-lm-2 dark:border-t-dm-2 flex justify-between gap-4">
      {children}
    </div>
  );
};

export default CardActions;