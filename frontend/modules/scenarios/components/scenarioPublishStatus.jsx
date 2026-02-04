import React from 'react';
import { Link } from 'react-router';

const ScenarioPublishStatus = ({
  scenarioId,
  hasChanges
}) => {
  if (hasChanges) {
    return (
      <div className="flex items-center justify-center text-xs text-black/60 dark:text-white/60 w-36 border border-lm-2 dark:border-dm-2 rounded-md px-1 py-1 hover:border-lm-3 dark:hover:border-dm-3 transition-all">
        <Link to={`/scenarios/${scenarioId}/share`} className="text-center" >
          Unpublished changes
        </Link>
      </div>
    );
  }
  return null;
};

export default ScenarioPublishStatus;