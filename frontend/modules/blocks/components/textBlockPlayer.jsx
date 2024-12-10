import React from 'react';
import getString from '~/modules/ls/helpers/getString';
import Body from '~/uikit/content/components/body';
import Title from '~/uikit/content/components/title';

const TextBlockPlayer = ({
  block
}) => {
  return (
    <div>
      <Title title={getString({ model: block, field: 'title' })} className="text-xl mb-2" />
      <Body body={getString({ model: block, field: 'body' })} className="text-sm text-black text-opacity-60 dark:text-white dark:text-opacity-60" />
    </div>
  );
};

export default TextBlockPlayer;