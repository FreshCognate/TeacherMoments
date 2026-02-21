import React from 'react';
import ActionBar from '~/uikit/actionBars/components/actionBar';
import Loading from '~/uikit/loaders/components/loading';
import CollectionEmpty from '~/uikit/collections/components/collectionEmpty';
import AnalyticsResponses from './analyticsResponses';
import AnalyticsSidePanel from './analyticsSidePanel';
import { AnalyticsViewType, UserResponse } from '../analytics.types';

interface AnalyticsProps {
  viewType: AnalyticsViewType;
  title?: string;
  responses: UserResponse[];
  isLoading: boolean;
  isSyncing?: boolean;
  searchValue?: string;
  currentPage?: number;
  totalPages?: number;
  onSearchValueChange?: (searchValue: string) => void;
  onPaginationClicked?: (direction: string) => void;
}

const Analytics: React.FC<AnalyticsProps> = ({
  viewType,
  title,
  responses,
  isLoading,
  isSyncing,
  searchValue,
  currentPage,
  totalPages,
  onSearchValueChange,
  onPaginationClicked
}) => {
  return (
    <div className="flex">
      <div className="flex-1 min-w-0 overflow-hidden">
        {!isLoading && title && (
          <h2 className="text-lg font-semibold mb-4">{title}</h2>
        )}
        {!isLoading && (
          <div className="mb-4">
            <ActionBar
              hasSearch
              hasPagination
              searchValue={searchValue}
              searchPlaceholder={viewType === 'byUserScenarios' ? 'Search by scenario name' : 'Search by username'}
              currentPage={currentPage}
              totalPages={totalPages}
              isSyncing={isSyncing}
              onSearchValueChange={onSearchValueChange}
              onPaginationClicked={onPaginationClicked}
            />
          </div>
        )}
        {isLoading && (
          <div className="flex justify-center">
            <Loading />
          </div>
        )}
        {!isLoading && !isSyncing && responses.length === 0 && (
          <CollectionEmpty
            attributes={{
              title: 'No responses',
              body: 'No responses available for this scenario'
            }}
          />
        )}
        {!isLoading && responses.length > 0 && (
          <AnalyticsResponses viewType={viewType} responses={responses} />
        )}
      </div>
      <div className="w-[480px] shrink-0 ml-4">
        <h2 className="text-lg font-semibold mb-4">Scenario preview</h2>
        <div className="border border-lm-2 dark:border-dm-2 rounded-lg p-4 bg-lm-1 dark:bg-dm-1">
          <AnalyticsSidePanel />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
