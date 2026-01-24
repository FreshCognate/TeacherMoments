import React from 'react';
import { Link } from 'react-router';

const ScenarioPublishStatus = ({
  scenarioId,
  hasChanges
}) => {
  if (hasChanges) {
    return (
      <div className="flex ml-2 items-center justify-center text-xs text-black/60 dark:text-white/60 w-36 border border-lm-1 dark:border-dm-2 rounded-md px-1 py-1">
        <Link to={`/scenarios/${scenarioId}/share`} className="text-center" >
          Unpublished changes
        </Link>
      </div>
    );
  }
  return null;
};

export default ScenarioPublishStatus;