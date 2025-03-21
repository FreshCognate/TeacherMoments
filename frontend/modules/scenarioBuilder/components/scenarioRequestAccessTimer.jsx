import React from 'react';
import Countdown from '~/uikit/timers/components/countdown';

const ScenarioRequestAccessTimer = ({
  value,
  onFinish
}) => {
  return (
    <div className="px-4 pb-4">
      <Countdown value={value} onFinish={onFinish} />
    </div>
  );
};

export default ScenarioRequestAccessTimer;