import React from 'react';
import { Link } from 'react-router';

const ScenarioPublishStatus = ({
  scenarioId,
  hasChanges
}) => {
  if (hasChanges) {
    return (
      <div className="ml-2">
        <Link to={`/scenarios/${scenarioId}/share`} className="opacity-60">
          Unpublished changes
        </Link>
      </div>
    );
  }
  return null;
};

export default ScenarioPublishStatus;