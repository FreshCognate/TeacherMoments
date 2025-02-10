import React from 'react';
import Timer from '~/uikit/loaders/components/timer';

const ScenarioRequestAccessTimer = ({
  value,
  onFinish
}) => {
  return (
    <div className="px-4 pb-4">
      <Timer value={value} onFinish={onFinish} />
    </div>
  );
};

export default ScenarioRequestAccessTimer;