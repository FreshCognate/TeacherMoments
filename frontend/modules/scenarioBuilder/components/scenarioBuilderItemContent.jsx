import React from 'react';
import Badge from '~/uikit/badges/components/badge';
import Title from '~/uikit/content/components/title';
import Icon from '~/uikit/icons/components/icon';
import classnames from 'classnames';
import EditSlideContainer from '~/modules/slides/containers/editSlideContainer';
import BlocksEditorContainer from '~/modules/blocks/containers/blocksEditorContainer';
import TriggerDisplayContainer from '~/modules/triggers/containers/triggerDisplayContainer';

const ScenarioBuilderItemContent = ({
  slide,
  location,
  isSelected,
  isEditing,
  onSelectSlideClicked,
  onEditSlideClicked
}) => {
  const className = classnames("relative border border-lm-3 dark:border-dm-3 bg-lm-0 dark:bg-dm-1 p-2 rounded-lg group transition-transform duration-700", {
    "w-[512px]": isEditing,
    "w-64": !isEditing
  });
  return (
    <div
      className={className}
      style={{ transform: `scale(${isSelected ? 1 : 0.8})` }}
    >
      <div className="flex">
        <Badge text={location} className="text-xs" />
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