import React from 'react';
import Body from '~/uikit/content/components/body';
import Title from '~/uikit/content/components/title';

const Card = ({
  children
}) => {
  return (
    <div className="bg-lm-1 dark:bg-dm-1 rounded-lg max-w-80 hover:shadow hover:bg-lm-2 hover:dark:bg-dm-2 flex flex-col">
      {children}
    </div>
  );
};

export default Card;