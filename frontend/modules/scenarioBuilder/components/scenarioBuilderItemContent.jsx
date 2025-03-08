import React from 'react';
import Badge from '~/uikit/badges/components/badge';
import Title from '~/uikit/content/components/title';
import Icon from '~/uikit/icons/components/icon';
import EditSlideContainer from '~/modules/slides/containers/editSlideContainer';
import BlocksEditorContainer from '~/modules/blocks/containers/blocksEditorContainer';
import TriggerDisplayContainer from '~/modules/triggers/containers/triggerDisplayContainer';
import FlatButton from '~/uikit/buttons/components/flatButton';
import Body from '~/uikit/content/components/body';
import Options from '~/uikit/dropdowns/components/options';

const ScenarioBuilderItemContent = ({
  slide,
  blocksCount,
  triggersCount,
  location,
  isSelected,
  isEditing,
  isEditingSibling,
  isOptionsOpen,
  isActioning,
  isLockedFromEditing,
  onSelectSlideClicked,
  onEditSlideClicked,
  onCancelEditingClicked,
  onOptionsToggled,
  onOptionClicked,
  onRequestAccessClicked
}) => {

  const optionActions = [{ action: 'MOVE', text: 'Move', icon: 'move' }, { action: 'DUPLICATE', text: 'Copy', icon: 'copy' }];

  if (!slide.isRoot) {
    optionActions.push({ action: 'DELETE', text: 'Delete', icon: 'delete', color: 'warning' });
  }

  return (
    <div
      className="relative  bg-lm-2 shadow dark:bg-dm-2 p-4 w-[440px] rounded-lg group"
      style={{
        transform: `scale(${isSelected ? 1 : 0.8})`,
        outline: isEditing ? "solid 2px rgba(255,255,255, 0)" : "none",
        maxHeight: isEditing ? '5000px' : '120px',
        height: isEditing ? 'auto' : '120px',
        overflow: 'hidden',
        transition: isEditing ? `transform 600ms 300ms, max-height ease-in-out 2000ms` : 'transform 300ms, max-height ease-in-out 4000ms 300ms'
      }}
    >
      <div className="flex justify-between">
        <div className="flex">
          <Badge text={location} className="text-xs" />
        </div>
        {(isEditing) && (
          <div className="flex items-center">
            <div className="mr-2 border-r border-lm-3 dark:border-dm-3 pr-2">
              <Options
                options={optionActions}
                isOpen={isOptionsOpen}
                onToggle={onOptionsToggled}
                onOptionClicked={onOptionClicked}
              />
            </div>
            <FlatButton icon="done" text="Done" size="sm" color="primary" onClick={onCancelEditingClicked} />
          </div>
        )}
      </div>
      {((!isSelected && !isEditing) && !isEditingSibling) && (
        <div
          className="group-hover:flex justify-center items-center hidden cursor-pointer absolute w-full h-full top-0 right-0 p-1 bg-opacity-40 bg-white dark:bg-black dark:bg-opacity-40 rounded-bl-lg rounded-tr-lg"
          onClick={onSelectSlideClicked}
        >
          <div>
            <Icon icon="select" />
          </div>
        </div>
      )}
      {(((isSelected && !isEditing) || (!isSelected && isEditingSibling)) && !isActioning && !isLockedFromEditing) && (
        <div
          className="group-hover:flex justify-center items-center hidden cursor-pointer absolute w-full h-full top-0 right-0 p-1 bg-opacity-40 bg-white dark:bg-black dark:bg-opacity-40 rounded-bl-lg rounded-tr-lg"
          onClick={onEditSlideClicked}
        >
          <div>
            <Icon icon="edit" />
          </div>
        </div>
      )}
      {(((isSelected && !isEditing) || (!isSelected && isEditingSibling)) && !isActioning && isLockedFromEditing) && (
        <div
          className="flex justify-center items-center absolute w-full h-full top-0 right-0 p-1 bg-opacity-40 bg-white dark:bg-black dark:bg-opacity-80 rounded-bl-lg rounded-tr-lg"
        >
          <div className="flex items-center">
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
      {(!isEditing) && (

        <div>
          <div className="my-2">
            <Title title={slide.name} className="text-black/80 dark:text-white/80" />
          </div>
          <div className="flex items-center text-black/60 dark:text-white/60">
            <div className="mr-4">
              <Body body={`Blocks: ${blocksCount}`} size="xs" />
            </div>
            <div>
              <Body body={`Triggers: ${triggersCount}`} size="xs" />
            </div>
          </div>
        </div>
      )}
      {(isEditing) && (
        <div>
          <EditSlideContainer slideId={slide._id} />
          <BlocksEditorContainer />
          <TriggerDisplayContainer elementRef={slide.ref} triggerType="SLIDE" event="ON_COMPLETE" />
        </div>
      )
      }
    </div >
  );
};

export default ScenarioBuilderItemContent;