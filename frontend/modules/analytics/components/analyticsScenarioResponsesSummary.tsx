import React from 'react';
import Loading from '~/uikit/loaders/components/loading';

interface AnalyticsScenarioResponsesSummaryProps {
  summary: string | null;
  isLoading: boolean;
}

const AnalyticsScenarioResponsesSummary: React.FC<AnalyticsScenarioResponsesSummaryProps> = ({
  summary,
  isLoading
}) => {
  return (
    <div className="p-4">
      {isLoading && <Loading />}
      {!isLoading && summary && (
        <p className="text-sm text-black/60 dark:text-white/60">{summary}</p>
      )}
    </div>
  );
};

export default AnalyticsScenarioResponsesSummary;
