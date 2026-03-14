import React from 'react';
import ActionBar from '~/uikit/actionBars/components/actionBar';
import Loading from '~/uikit/loaders/components/loading';
import CollectionEmpty from '~/uikit/collections/components/collectionEmpty';
import AnalyticsResponses from './analyticsResponses';
import AnalyticsResponsesTableContainer from '../containers/analyticsResponsesTableContainer';
import AnalyticsSidePanel from './analyticsSidePanel';
import { AnalyticsViewType, SlideGroup, UserResponse } from '../analytics.types';

interface AnalyticsProps {
  viewType: AnalyticsViewType;
  scenarioId?: string;
  title?: string;
  responses: UserResponse[];
  selectedResponse: UserResponse | null;
  selectedBlockResponseRef: string | null;
  selectedSlideRef: string | null;
  isLoading: boolean;
  isSyncing?: boolean;
  searchValue?: string;
  currentPage?: number;
  totalPages?: number;
  isUserUpDisabled?: boolean;
  isUserDownDisabled?: boolean;
  onSearchValueChange?: (searchValue: string) => void;
  onPaginationClicked?: (direction: string) => void;
  onResponseClicked: (response: UserResponse, blockResponseRef: string) => void;
  onSlideNavigated: (slideRef: string) => void;
  onBlockNavigated: (blockRef: string) => void;
  onUserNavigated?: (direction: string) => void;
  onExportClicked?: () => void;
  onSidePanelClose: () => void;
  onSummarizeSlide: (slideGroup: SlideGroup) => void;
  onSummarizeScenario: () => void;
  onSummarizeUser: (response: UserResponse) => void;
}

const Analytics: React.FC<AnalyticsProps> = ({
  viewType,
  scenarioId,
  title,
  responses,
  selectedResponse,
  selectedBlockResponseRef,
  selectedSlideRef,
  isLoading,
  isSyncing,
  searchValue,
  currentPage,
  totalPages,
  isUserUpDisabled,
  isUserDownDisabled,
  onSearchValueChange,
  onPaginationClicked,
  onResponseClicked,
  onSlideNavigated,
  onBlockNavigated,
  onUserNavigated,
  onExportClicked,
  onSidePanelClose,
  onSummarizeSlide,
  onSummarizeScenario,
  onSummarizeUser
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
              searchPlaceholder={viewType === 'byUserScenarios' ? 'Search by scenario' : 'Search by username'}
              currentPage={currentPage}
              totalPages={totalPages}
              isSyncing={isSyncing}
              actions={onExportClicked ? [{ action: 'EXPORT_CSV', text: 'Export CSV' }] : undefined}
              onSearchValueChange={onSearchValueChange}
              onPaginationClicked={onPaginationClicked}
              onActionClicked={({ action }) => {
                if (action === 'EXPORT_CSV' && onExportClicked) {
                  onExportClicked();
                }
              }}
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
        {!isLoading && responses.length > 0 && viewType === 'byScenarioUsers' && scenarioId && (
          <AnalyticsResponsesTableContainer
            responses={responses}
            selectedResponse={selectedResponse}
            selectedBlockResponseRef={selectedBlockResponseRef}
            selectedSlideRef={selectedSlideRef}
            onResponseClicked={onResponseClicked}
            onSlideNavigated={onSlideNavigated}
            onBlockNavigated={onBlockNavigated}
            onSummarizeSlide={onSummarizeSlide}
            onSummarizeScenario={onSummarizeScenario}
            onSummarizeUser={onSummarizeUser}
          />
        )}
        {!isLoading && responses.length > 0 && viewType === 'byUserScenarios' && (
          <AnalyticsResponses
            viewType={viewType}
            responses={responses}
            selectedResponse={selectedResponse}
            selectedBlockResponseRef={selectedBlockResponseRef}
            selectedSlideRef={selectedSlideRef}
            onResponseClicked={onResponseClicked}
            onSlideNavigated={onSlideNavigated}
            onBlockNavigated={onBlockNavigated}
            onSummarizeUser={onSummarizeUser}
          />
        )}
      </div>
      <div className="w-[480px] shrink-0 ml-4 sticky top-32 self-start">
        <AnalyticsSidePanel
          viewType={viewType}
          selectedResponse={selectedResponse}
          selectedBlockResponseRef={selectedBlockResponseRef}
          selectedSlideRef={selectedSlideRef}
          isUserUpDisabled={isUserUpDisabled}
          isUserDownDisabled={isUserDownDisabled}
          onSlideNavigated={onSlideNavigated}
          onBlockNavigated={onBlockNavigated}
          onUserNavigated={onUserNavigated}
          onClose={onSidePanelClose}
        />
      </div>
    </div>
  );
};

export default Analytics;
