import React from 'react';
import Badge from '~/uikit/badges/components/badge';
import Title from '~/uikit/content/components/title';
import Icon from '~/uikit/icons/components/icon';
import EditSlideContainer from '~/modules/slides/containers/editSlideContainer';
import BlocksEditorContainer from '~/modules/blocks/containers/blocksEditorContainer';
import TriggerDisplayContainer from '~/modules/triggers/containers/triggerDisplayContainer';
import FlatButton from '~/uikit/buttons/components/flatButton';

const ScenarioBuilderItemContent = ({
  slide,
  location,
  isSelected,
  isEditing,
  onSelectSlideClicked,
  onEditSlideClicked,
  onCancelEditingClicked
}) => {
  return (
    <div
      className="relative border border-lm-3 dark:border-dm-3 bg-lm-0 dark:bg-dm-1 p-2 w-[440px] rounded-lg group transition-transform duration-700"
      style={{
        transform: `scale(${isSelected ? 1 : 0.9})`,
        outline: isSelected ? "solid 2px rgba(255,255,255, 0.2)" : "none"
      }}
    >
      <div className="flex justify-between">
        <div className="flex">
          <Badge text={location} className="text-xs" />
        </div>
        {(isEditing) && (
          <div>
            <FlatButton icon="done" text="Done" size="sm" color="primary" onClick={onCancelEditingClicked} />
          </div>
        )}
      </div>
      {(!isSelected && !isEditing) && (
        <div
          className="group-hover:flex justify-center items-center hidden cursor-pointer absolute w-full h-full top-0 right-0 p-1 bg-opacity-40 bg-white dark:bg-black dark:bg-opacity-40 rounded-bl-lg rounded-tr-lg"
          onClick={onSelectSlideClicked}
        >
          <div>
            <Icon icon="select" />
          </div>
        </div>
      )}
      {(isSelected && !isEditing) && (
        <div
          className="group-hover:flex justify-center items-center hidden cursor-pointer absolute w-full h-full top-0 right-0 p-1 bg-opacity-40 bg-white dark:bg-black dark:bg-opacity-40 rounded-bl-lg rounded-tr-lg"
          onClick={onEditSlideClicked}
        >
          <div>
            <Icon icon="edit" />
          </div>
        </div>
      )}
      <Title title={slide.name} />
      {(isEditing) && (
        <div>
          <EditSlideContainer slideId={slide._id} />
          <div className="border-t border-t-lm-3 dark:border-t-dm-3 pt-4">
            <TriggerDisplayContainer elementRef={slide.ref} triggerType="SLIDE" event="ON_ENTER" />
            <BlocksEditorContainer isNewEditor />
            <TriggerDisplayContainer elementRef={slide.ref} triggerType="SLIDE" event="ON_EXIT" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ScenarioBuilderItemContent;