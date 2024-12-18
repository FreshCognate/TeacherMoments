import React from 'react';
import map from 'lodash/map';
import Body from '~/uikit/content/components/body';
import includes from 'lodash/includes';

const triggerBlocksSelector = ({
  blocks,
  value,
  onBlockToggled
}) => {
  return (
    <div>
      {map(blocks, (block) => {
        const isSelected = includes(value, block.ref);
        return (
          <label
            key={block._id}
            className="flex items-start border border-lm-2 dark:border-dm-2 mb-2 rounded-md p-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={isSelected}
              className="mr-2 mt-0.5"
              onChange={() => onBlockToggled(block.ref)}
            />
            <div>
              <Body body={block.blockType} size="sm" />
            </div>
          </label>
        );
      })}
    </div>
  );
};

export default triggerBlocksSelector;