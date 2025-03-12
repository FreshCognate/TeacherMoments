import React from 'react';
import CreateNavigationContainer from '../containers/createNavigationContainer';

const Create = ({
}) => {
  return (
    <div
      id="scenario-builder"
      style={{ height: 'calc(100vh - 68px', marginTop: '28px' }}
      className="bg-lm-2 dark:bg-dm-2"
    >
      <CreateNavigationContainer />
    </div>
  );
};

export default Create;