import React from 'react';
import TextBlockPlayerContainer from '~/modules/blocks/containers/textBlockPlayerContainer';
import Loading from '~/uikit/loaders/components/loading';
import map from 'lodash/map';
import PromptBlockPlayerContainer from '~/modules/blocks/containers/promptBlockPlayerContainer';
import ActionsBlockPlayerContainer from '~/modules/blocks/containers/actionsBlockPlayerContainer';
import getBlockTracking from '~/modules/tracking/helpers/getBlockTracking';
const BLOCK_MAPPINGS = {
  "TEXT": TextBlockPlayerContainer,
  "PROMPT": PromptBlockPlayerContainer,
  "ACTIONS": ActionsBlockPlayerContainer
}

const SlidePlayer = ({
  activeSlide,
  activeBlocks,
  onUpdateTracking,
}) => {
  if (!activeSlide) return (
    <Loading />
  );
  return (
    <div className="w-full border border-lm-2 dark:border-dm-2 rounded max-w-screen-sm p-4">
      {map(activeBlocks, (block) => {
        let Block = BLOCK_MAPPINGS[block.blockType];
        if (!Block) return <div key={block._id} className="mb-4 last:mb-0">Block is unsupported</div>;
        const blockTracking = getBlockTracking({ blockRef: block.ref })
        return (
          <div
            key={block._id}
            className="mb-4 last:mb-0"
          >
            <Block
              block={block}
              tracking={blockTracking}
              onUpdateTracking={(update) => {
                onUpdateTracking({ update, blockRef: block.ref });
              }}
            />
          </div>
        );
      })}
    </div >
  );
};

export default SlidePlayer;