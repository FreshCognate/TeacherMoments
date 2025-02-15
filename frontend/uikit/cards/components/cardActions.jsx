import React from 'react';

const CardActions = ({
  children
}) => {
  if (!children) return null;
  return (
    <div className="px-4 py-2 flex justify-between gap-4">
      {children}
    </div>
  );
};

export default CardActions;