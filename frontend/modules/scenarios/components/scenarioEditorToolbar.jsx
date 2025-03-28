import React from 'react';
import FlatButton from '~/uikit/buttons/components/flatButton';
import Toggle from '~/uikit/toggles/components/toggle';

const ScenarioEditorToolbar = ({
  displayMode,
  onDisplayModeChanged,
  onAddBlockClicked
}) => {
  return (
    <div className="fixed top-20 flex items-center justify-between z-40 bg-lm-1 dark:bg-dm-1 rounded-lg text-xs mx-2 ">
      <div className="pl-1 pr-1 py-1">
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