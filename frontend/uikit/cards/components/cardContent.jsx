import React from 'react';

const CardContent = ({
  children
}) => {
  return (
    <div className="p-4 flex-1 flex-grow">
      {children}
    </div>
  );
};

export default CardContent;