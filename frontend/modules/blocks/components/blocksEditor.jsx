import React from 'react';
import map from 'lodash/map';
import FlatButton from '~/uikit/buttons/components/flatButton';
import EditBlockContainer from '../containers/editBlockContainer';
import Icon from '~/uikit/icons/components/icon';
import Body from '~/uikit/content/components/body';
import Title from '~/uikit/content/components/title';

const BlocksEditor = ({
  slides,
  blocks,
  triggers,
  isLockedFromEditing,
  onSortUpClicked,
  onSortDownClicked,
  onCreateBlockClicked,
  onRequestAccessClicked,
  onOpenTriggersClicked
}) => {
  return (
    <div className="w-full  max-w-screen-lg mx-auto">
      <div className="relative">
        {(isLockedFromEditing) && (
          <div
            className="flex justify-center items-start absolute w-full h-full top-0 z-20 right-0 p-1 bg-opacity-40 bg-white dark:bg-black dark:bg-opacity-80 rounded-lg"
          >
            <div className="flex items-center pt-8 sticky top-0">
              <div className="mr-2">
                <Icon icon="locked" />
              </div>
              <div>
                <Body body="Another user is editing this slide" size="sm" />
                <FlatButton
                  text="Request access?"
                  color="primary"
                  onClick={onRequestAccessClicked}
                />
              </div>
            </div>
          </div>
        )}

        <div className="p-8" style={{ minHeight: "calc(100vh - 261px)" }}>
          {(map(blocks, (block) => {
            return (
              <EditBlockContainer
                key={block._id}
                block={block}
                blocksLength={blocks.length}
                onSortUpClicked={onSortUpClicked}
                onSortDownClicked={onSortDownClicked}
              />
            )
          }))}
          {(blocks.length === 0) && (
            <div className="p-8 text-center max-w-xl mx-auto">
              {(slides.length === 1) && (
                <>
                  <Title title="Welcome to the Scenario Creator" className="text-black dark:text-white/80 mb-2" />
                  <Body body="Teacher Moments is a practice space for teachers to rehearse responses to real-life scenarios. To build your simulation, you will use three main elements:" size="sm" className="text-black/60 dark:text-white/60 mb-2" />
                  <Body body="📰 Slides: Think of these as the scenes in your scenario. They are the largest containers that hold everything else." size="sm" className="text-black/60 dark:text-white/60 mb-2" />
                  <Body body="📦 Blocks: These are the individual pieces of content that make up a scene. You can add text, images, or input prompts for the user to interact with. (Tip: Max. 3-4 blocks per slide)" size="sm" className="text-black/60 dark:text-white/60 mb-2" />
                  <Body body="⚡ Triggers: These define the logic. You can add triggers to input prompts to give specific feedback or determine what happens next." size="sm" className="text-black/60 dark:text-white/60 mb-2" />
                </>
              )}
              <Title title="This slide has no blocks" className="text-black dark:text-white/80 mb-2" />
              <Body body="Click Add block to create a new block for this slide" size="sm" className="text-black/60 dark:text-white/60" />
            </div>
          )}
        </div>
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
      </div>
    </div>
  );
};

export default BlocksEditor;