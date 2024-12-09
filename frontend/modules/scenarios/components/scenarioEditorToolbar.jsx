import React from 'react';
import FlatButton from '~/uikit/buttons/components/flatButton';
import Toggle from '~/uikit/toggles/components/toggle';

const ScenarioEditorToolbar = ({
  displayMode,
  onDisplayModeChanged,
  onAddBlockClicked
}) => {
  return (
    <div className="flex items-center justify-between bg-lm-1 dark:bg-dm-1 rounded-lg text-xs mx-2 border border-lm-2 dark:border-dm-2 mb-4">
      <div>
        <FlatButton icon="addBlock" text="Add block" className="px-4 py-1" size="sm" onClick={onAddBlockClicked} />
      </div>
      <div className="border-l border-lm-2 dark:border-dm-2 pl-4 pr-1 py-1">
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
  );
};

export default ScenarioEditorToolbar;