import React from 'react';
import Body from '~/uikit/content/components/body';
import Title from '~/uikit/content/components/title';

const Card = ({
  name,
  title,
  description
}) => {
  return (
    <div className="bg-lm-1 dark:bg-dm-1 rounded-lg max-w-80 p-4 hover:shadow hover:bg-lm-2 hover:dark:bg-dm-2">
      <div>
        <Title title={name} />
        <Body body={title} />
        <Body body={description} />
      </div>
    </div>
  );
};

export default Card;