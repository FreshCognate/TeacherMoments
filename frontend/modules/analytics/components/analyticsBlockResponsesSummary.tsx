import React from 'react';
import { BlockColumn, UserResponse } from '../analytics.types';

interface AnalyticsBlockResponsesSummaryProps {
  blockColumn: BlockColumn;
  responses: UserResponse[];
}

const AnalyticsBlockResponsesSummary: React.FC<AnalyticsBlockResponsesSummaryProps> = ({
  blockColumn,
  responses
}) => {
  return (
    <div className="p-4">
      <p className="text-sm text-black/60 dark:text-white/60">
        {blockColumn.name || blockColumn.ref || `Block ${blockColumn.sortOrder + 1}`}
      </p>
    </div>
  );
};

export default AnalyticsBlockResponsesSummary;
