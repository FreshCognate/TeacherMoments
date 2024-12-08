import React from 'react';
import { Outlet } from 'react-router';
import Toggle from '~/uikit/toggles/components/toggle';

const ScenarioEditor = ({
  pathValue,
  onToggleClicked
}) => {
  return (
    <div>
      <Toggle
        value={pathValue}
        options={[{
          value: 'edit',
          text: 'Edit'
        }, {
          value: 'create',
          text: 'Create'
        }, {
          value: 'preview',
          text: 'Preview'
        }]}
        onClick={onToggleClicked}
      />
      <Outlet />
    </div>
  );
};

export default ScenarioEditor;