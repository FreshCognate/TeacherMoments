import React from 'react';
import SlidesPanelContainer from '~/modules/slides/containers/slidesPanelContainer';

const CreateScenario = ({
}) => {
  return (
    <div className="flex justify-between" style={{ height: 'calc(100vh - 80px)' }}>
      <div className="bg-lm-1 dark:bg-dm-1 rounded-lg min-w-60 ml-2 my-2">
        <SlidesPanelContainer />
      </div>
      <div className="w-full my-2">
        <div className="bg-lm-1 dark:bg-dm-1 rounded-lg mx-2">
          Toolbar
        </div>
        <div className="mx-2">
          Main content
        </div>
      </div>
      <div className="bg-lm-1 dark:bg-dm-1 rounded-lg min-w-60 mr-2 my-2">
        Right side panel
      </div>
    </div>
  );
};

export default CreateScenario;