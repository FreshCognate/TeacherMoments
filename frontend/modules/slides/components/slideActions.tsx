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
    <div>
      <Body body={`You've added a prompt, would you like to give the user feedback based upon their answer or branch to stem?`} />
    </div>
  );
};

export default SlideActions;