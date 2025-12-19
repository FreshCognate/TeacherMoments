import React from 'react';
import Title from '~/uikit/content/components/title';
import Loading from '~/uikit/loaders/components/loading';

const Invite = ({
}) => {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="flex items-center">
        <div>
          <Loading />
        </div>
        <Title title="Checking invite..." />
      </div>
    </div>
  );
};

export default Invite;