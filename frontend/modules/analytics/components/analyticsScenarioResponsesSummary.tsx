import React from 'react';
import Loading from '~/uikit/loaders/components/loading';

interface AnalyticsScenarioResponsesSummaryProps {
  scenarioName?: string;
  summary: string | null;
  isLoading: boolean;
}

const AnalyticsScenarioResponsesSummary: React.FC<AnalyticsScenarioResponsesSummaryProps> = ({
  scenarioName,
  summary,
  isLoading
}) => {
  return (
    <div className="p-4">
      {scenarioName && (
        <p className="text-sm font-medium text-black/80 dark:text-white/80 mb-4">
          Scenario: {scenarioName}
        </p>
      )}
      {isLoading && <Loading />}
      {!isLoading && summary && (
        <p className="text-sm text-black/60 dark:text-white/60">{summary}</p>
      )}
    </div>
  );
};

export default AnalyticsScenarioResponsesSummary;
