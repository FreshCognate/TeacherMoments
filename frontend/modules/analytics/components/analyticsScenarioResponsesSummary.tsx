import React from 'react';
import Loading from '~/uikit/loaders/components/loading';
import each from 'lodash/each';

interface SummarySection {
  title: string;
  content: string;
}

interface SummaryData {
  overview: string;
  sections: SummarySection[];
  summary: string;
}

interface AnalyticsScenarioResponsesSummaryProps {
  scenarioName?: string;
  summaryData: SummaryData | null;
  isLoading: boolean;
}

const AnalyticsScenarioResponsesSummary: React.FC<AnalyticsScenarioResponsesSummaryProps> = ({
  scenarioName,
  summaryData,
  isLoading
}) => {

  const renderSections = () => {
    if (!summaryData?.sections?.length) return null;

    const sectionElements: React.ReactNode[] = [];

    each(summaryData.sections, (section, index) => {
      sectionElements.push(
        <div
          key={index}
          className="py-3 border-b border-black/10 dark:border-white/10 last:border-b-0"
        >
          {section.title && (
            <h3 className="text-sm font-medium text-black/80 dark:text-white/80 mb-1">
              {section.title}
            </h3>
          )}
          <p className="text-sm text-black/60 dark:text-white/60">
            {section.content}
          </p>
        </div>
      );
    });

    return sectionElements;
  };

  return (
    <div className="p-4">
      {scenarioName && (
        <h1 className="text-xl font-semibold text-black/80 dark:text-white/80 mb-4">
          Scenario: {scenarioName}
        </h1>
      )}
      {isLoading && <Loading />}
      {!isLoading && summaryData && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-semibold text-black/80 dark:text-white/80 mb-2 underline">Overview</h2>
            <p className="text-sm text-black/60 dark:text-white/60">{summaryData.overview}</p>
          </div>
          {summaryData.sections?.length > 0 && (
            <div>
              <h2 className="text-base font-semibold text-black/80 dark:text-white/80 mb-2 underline">Key findings</h2>
              {renderSections()}
            </div>
          )}
          {summaryData.summary && (
            <div>
              <h2 className="text-base font-semibold text-black/80 dark:text-white/80 mb-2 underline">Summary</h2>
              <p className="text-sm text-black/60 dark:text-white/60">{summaryData.summary}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalyticsScenarioResponsesSummary;
