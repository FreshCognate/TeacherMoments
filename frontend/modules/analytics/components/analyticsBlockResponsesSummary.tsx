import React from 'react';
import Loading from '~/uikit/loaders/components/loading';
import { BlockColumn, UserResponse } from '../analytics.types';

interface AnalyticsBlockResponsesSummaryProps {
  blockColumn: BlockColumn;
  responses: UserResponse[];
  summary: string | null;
  isLoading: boolean;
}

const AnalyticsBlockResponsesSummary: React.FC<AnalyticsBlockResponsesSummaryProps> = ({
  blockColumn,
  responses,
  summary,
  isLoading
}) => {
  return (
    <div className="p-4">
      <p className="text-sm font-medium text-black/80 dark:text-white/80 mb-4">
        {blockColumn.name || blockColumn.ref || `Block ${blockColumn.sortOrder + 1}`}
      </p>
      {isLoading && <Loading />}
      {!isLoading && summary && (
        <p className="text-sm text-black/60 dark:text-white/60">{summary}</p>
      )}
    </div>
  );
};

export default AnalyticsBlockResponsesSummary;
