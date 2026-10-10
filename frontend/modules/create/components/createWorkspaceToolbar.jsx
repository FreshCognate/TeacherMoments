import React from 'react';
import hasFlag from '~/modules/flags/helpers/hasFlag';
import Button from '~/uikit/buttons/components/button';
import FlatButton from '~/uikit/buttons/components/flatButton';
import Switch from '~/uikit/toggles/components/switch';
import Toggle from '~/uikit/toggles/components/toggle';

const CreateWorkspaceToolbar = ({
  slide,
  displayMode,
  isStaticSlide,
  isOverviewVisible,
  hasMultipleStems,
  onDisplayModeChanged,
  onAddBlockClicked,
  onSlideNameChanged,
  onToggleOverviewClicked
}) => {
  const displayModeOptions = [{
    value: 'EDITING',
    text: 'Edit'
  }, {
    value: 'PREVIEW',
    text: 'Preview'
  }];
  return (
    <div className="sticky w-full top-0 flex items-center justify-between z-40 border-b border-b-lm-2 dark:border-b-dm-2 bg-lm-0 dark:bg-dm-1 text-xs">
      <div className="flex items-center">
        {(!isStaticSlide) && (
          <>
            <div className="pl-2 pr-2">
              <input
                type="text"
                value={slide.name}
                placeholder="Slide title"
                className="py-1 px-2 rounded-md text-sm text-black/80 dark:text-white/80 bg-lm-3/50 dark:bg-dm-3/50 focus:outline-2 outline-lm-4 dark:outline-dm-4 outline-offset-0"
                onChange={onSlideNameChanged}
              />
            </div>
            <div className="border-l border-lm-2 dark:border-dm-2" style={{ width: '2px', height: '24px' }} />
            <div className="pl-3 pr-3">
              <FlatButton text="Add block" icon="create" size="sm" onClick={onAddBlockClicked} />
            </div>
            <div className="border-l border-lm-2 dark:border-dm-2" style={{ width: '2px', height: '24px' }} />
          </>
        )}
        <div className="pl-3 pr-3 py-1 ">
          <Toggle
            size="sm"
            value={displayMode}
            options={displayModeOptions}
            onClick={onDisplayModeChanged}
          />
        </div>
      </div>
      <div className="pr-2">
        {(hasMultipleStems) && (
          <div className="pr-2 pl-1 py-1 border border-lm-1 dark:border-dm-2 rounded-full flex">
            <Switch
              label="Overview"
              value={isOverviewVisible}
              size='sm'
              onChange={onToggleOverviewClicked} />
          </div>
        )}
      </div>
    </div >
  );
};

export default CreateWorkspaceToolbar;