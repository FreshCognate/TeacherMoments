import React from 'react';
import FlatButton from '~/uikit/buttons/components/flatButton';
import Toggle from '~/uikit/toggles/components/toggle';

const CreateWorkspaceToolbar = ({
  slide,
  displayMode,
  onDisplayModeChanged,
  onAddBlockClicked,
  onSlideNameChanged
}) => {
  return (
    <div className="fixed top-20 flex items-center justify-between z-40 bg-lm-1 dark:bg-dm-1 rounded-lg text-xs mx-2 ">
      <div className="pl-2 pr-2">
        <input
          type="text"
          value={slide.name}
          placeholder="Slide title"
          className="p-1 rounded-md text-sm text-black/80 dark:text-white/80 bg-lm-4/50 dark:bg-dm-4/50 focus:outline-2 outline-lm-4 dark:outline-dm-4 outline-offset-0"
          //className="py-3 px-3 text-sm text-black/80 dark:text-white/80 bg-lm-4/50 dark:bg-dm-4/50 rounded w-full focus:outline-2 outline-lm-4 dark:outline-dm-4 outline-offset-2"
          onChange={onSlideNameChanged}
        />
      </div>
      <div className="pl-2 pr-3">
        <FlatButton text="Add block" icon="create" size="sm" onClick={onAddBlockClicked} />
      </div>
      <div className=" border-l border-lm-0 dark:border-dm-2">
        <div className="pl-1 pr-1 py-1 ">
          <Toggle
            size="sm"
            value={displayMode}
            options={[{
              value: 'EDITING',
              text: 'Edit'
            }, {
              value: 'PREVIEW',
              text: 'Preview'
            }]}
            onClick={onDisplayModeChanged}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateWorkspaceToolbar;