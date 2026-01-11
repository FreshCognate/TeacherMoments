import React from 'react';
import Body from '~/uikit/content/components/body';
import Title from '~/uikit/content/components/title';

const Card = ({
  children
}) => {
  return (
    <div className="bg-lm-0 border border-lm-3 dark:border-none dark:bg-dm-1 dark:hover:bg-dm-2 rounded-lg max-w-80 hover:shadow  flex flex-col">
      {children}
    </div>
  );
};

export default Card;