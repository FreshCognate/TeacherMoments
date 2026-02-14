import React from 'react';
import map from 'lodash/map';
import Body from '~/uikit/content/components/body';
import includes from 'lodash/includes';
import getString from '~/modules/ls/helpers/getString';
import getBlockDisplayName from '~/modules/blocks/helpers/getBlockDisplayName';
import Alert from '~/uikit/alerts/components/alert';


const triggerBlocksSelector = ({
  blocks,
  value,
  onBlockToggled
}) => {
  return (
    <div>
      {(blocks.length === 0) && (
        <div>
          <Alert type="warning" text="This slide needs input prompts before you can create feedback triggers. Add a Multiple Choice or Input Prompt block to this slide first, then return here to configure feedback." />
        </div>
      )}
      {map(blocks, (block) => {
        const isSelected = includes(value, block.ref);
        const blockDisplayName = getBlockDisplayName(block);
        return (
          <label
            key={block._id}
            className="flex items-center border border-lm-2 dark:border-dm-2 mb-2 rounded-md p-4 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={isSelected}
              className="mr-4"
              onChange={() => onBlockToggled(block.ref)}
            />
            <div className="w-full">
              <div className="flex items-center mb-2">
                <div className="w-1/4">
                  <Body body="Block type:" size="sm" />
                </div>
                <div>
                  <Body body={blockDisplayName} size="sm" />
                </div>
              </div>
              <div className="flex w-full items-center">
                <div className="w-1/4">
                  <Body body="Prompt:" size="sm" />
                </div>
                <div>
                  <Body body={getString({ model: block, field: 'body' })} size="sm" />
                </div>
              </div>

            </div>
          </label>
        );
      })}
    </div >
  );
};

export default triggerBlocksSelector;