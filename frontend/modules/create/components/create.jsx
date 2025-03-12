import React from 'react';
import CreateNavigationContainer from '../containers/createNavigationContainer';
import CreateWorkspaceContainer from '../containers/createWorkspaceContainer';
import CreateSettingsContainer from '../containers/createSettingsContainer';

const Create = ({
}) => {
  return (
    <div
      id="scenario-builder"
      style={{ height: 'calc(100vh - 68px', marginTop: '28px' }}
      className="bg-lm-2 dark:bg-dm-2 flex"
    >
      <CreateNavigationContainer />
      <CreateWorkspaceContainer />
      <CreateSettingsContainer />
    </div>
  );
};

export default Create;