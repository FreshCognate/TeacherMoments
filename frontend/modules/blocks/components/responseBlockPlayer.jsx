import React from 'react';
import Body from '~/uikit/content/components/body';
import getBlockComponent from '../helpers/getBlockComponent';
import Alert from '~/uikit/alerts/components/alert';
import Badge from '~/uikit/badges/components/badge';

const ResponseBlockPlayer = ({
  block,
  blockType,
  blockTracking,
  hasError,
  error
}) => {
  const Block = getBlockComponent({ blockType });
  return (
    <div className="border border-lm-2 dark:border-dm-2 p-4 rounded-md bg-lm-2/60 dark:bg-dm-2/60">
      <div className="flex mb-2">
        <Badge text="Previous response" icon="info" className="text-xs" />
      </div>
      {(hasError) && (
        <Alert type="warning" text={error} />
      )}
      {(Block && !hasError) && (
        <Block
          block={block}
          blockTracking={blockTracking}
          isResponseBlock
        />
      )}
    </div>
  );
};

export default ResponseBlockPlayer;