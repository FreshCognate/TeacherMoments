import React from 'react';

const CreateScenario = ({
}) => {
  return (
    <div className="flex justify-between" style={{ height: 'calc(100vh - 80px)' }}>
      <div className="bg-lm-1 dark:bg-dm-1 rounded-lg w-72 ml-2 my-2">
        Left side panel
      </div>
      <div className="w-full my-2">
        <div className="bg-lm-1 dark:bg-dm-1 rounded-lg mx-2">
          Toolbar
        </div>
        <div className="mx-2">
          Main content
        </div>
      </div>
      <div className="bg-lm-1 dark:bg-dm-1 rounded-lg w-72 mr-2 my-2">
        Right side panel
      </div>
    </div>
  );
};

export default CreateScenario;