import React from 'react';
import Body from '~/uikit/content/components/body';
import Title from '~/uikit/content/components/title';
import map from 'lodash/map';

const BlockSelector = ({
  blocks,
  onAddBlockTypeClicked
}) => {
  return (
    <div>
      {map(blocks, (block) => {
        return (
          <div
            key={block.blockType}
            className="bg-lm-0 dark:bg-dm-0 border-t border-lm-1 dark:border-dm-1 p-4 cursor-pointer hover:bg-lm-1 dark:hover:bg-dm-1 transition-colors"
            onClick={() => onAddBlockTypeClicked(block.blockType)}
          >
            <Title
              title={block.displayName}
              element="h4"
            />
            <Body
              body={block.description}
              size="sm"
              className="opacity-60"
            />
          </div>
        );
      })}
    </div>
  );
};

export default BlockSelector;