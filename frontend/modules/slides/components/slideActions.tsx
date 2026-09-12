import React from 'react';
import { Block } from '~/modules/blocks/blocks.types';
import { Trigger } from '~/modules/triggers/triggers.types';
import FlatButton from '~/uikit/buttons/components/flatButton';
import Body from '~/uikit/content/components/body';

const SlideActions = ({
  blocks,
  triggers,
  onOpenTriggersClicked,
  onCreateBlockClicked
}: {
  blocks: Block[]
  triggers: Trigger[]
  onOpenTriggersClicked: () => void;
  onCreateBlockClicked: () => void;
}) => {
  return (
    <>
      {(blocks.length > 0) && (
        <div className="px-8 flex justify-between sticky bottom-0 bg-lm-0 dark:bg-dm-1 border-t border-t-lm-3 dark:border-t-dm-2 py-4">
          <div>
            <FlatButton
              text="Edit triggers"
              icon="trigger"
              onClick={onOpenTriggersClicked}
            />
            <Body
              body={triggers.length === 0 ? 'Add triggers to provide feedback on user responses' : `This slide has ${triggers.length} trigger${triggers.length > 1 || triggers.length === 0 ? 's' : ''}`}
              size="xs"
              className="text-black/60 dark:text-white/80"
            />
          </div>
          <div className="flex flex-col items-end">
            <FlatButton
              text="Add block"
              icon="create"
              onClick={onCreateBlockClicked}
            />
            <Body
              body={`This slide has ${blocks.length} block${blocks.length > 1 ? 's' : ''}`}
              size="xs"
              className="text-black/60 dark:text-white/80"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default SlideActions;