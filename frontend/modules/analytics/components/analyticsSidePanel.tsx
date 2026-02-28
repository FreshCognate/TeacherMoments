import React from 'react';
import CollectionEmpty from '~/uikit/collections/components/collectionEmpty';
import FlatButton from '~/uikit/buttons/components/flatButton';
import getUserDisplayName from '~/modules/users/helpers/getUserDisplayName';
import AnalyticsSlideViewerContainer from '../containers/analyticsSlideViewerContainer';
import { AnalyticsViewType, UserResponse } from '../analytics.types';

interface AnalyticsSidePanelProps {
  viewType: AnalyticsViewType;
  selectedResponse: UserResponse | null;
  selectedBlockResponseRef: string | null;
  isUserUpDisabled?: boolean;
  isUserDownDisabled?: boolean;
  onSlideNavigated: (blockResponseRef: string) => void;
  onUserNavigated?: (direction: string) => void;
  onClose: () => void;
}

const AnalyticsSidePanel: React.FC<AnalyticsSidePanelProps> = ({
  viewType,
  selectedResponse,
  selectedBlockResponseRef,
  isUserUpDisabled,
  isUserDownDisabled,
  onSlideNavigated,
  onUserNavigated,
  onClose
}) => {
  const title = selectedResponse
    ? viewType === 'byUserScenarios'
      ? selectedResponse.scenario?.name || 'Unknown scenario'
      : getUserDisplayName(selectedResponse.user)
    : null;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Scenario preview</h2>
      <div className="border border-lm-2 dark:border-dm-2 rounded-lg p-4 bg-lm-1 dark:bg-dm-1">
        {!selectedResponse && (
          <div className="flex items-center justify-center">
            <CollectionEmpty
              attributes={{
                title: 'No response selected',
                body: 'Select a response to view it in the slide context'
              }}
            />
          </div>
        )}
        {selectedResponse && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold">{title}</h3>
              <FlatButton icon="cancel" onClick={onClose} />
            </div>
            {viewType === 'byScenarioUsers' && onUserNavigated && (
              <div className="flex items-center gap-1 mb-3">
                <FlatButton icon="paginationUp" color="primary" isDisabled={isUserUpDisabled} ariaLabel="Previous user" onClick={() => onUserNavigated('up')} />
                <FlatButton icon="paginationDown" color="primary" isDisabled={isUserDownDisabled} ariaLabel="Next user" onClick={() => onUserNavigated('down')} />
              </div>
            )}
            {(viewType !== 'byScenarioUsers' || !onUserNavigated) && <div className="mb-3" />}
            <AnalyticsSlideViewerContainer
              selectedResponse={selectedResponse}
              selectedBlockResponseRef={selectedBlockResponseRef}
              onSlideNavigated={onSlideNavigated}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsSidePanel;
