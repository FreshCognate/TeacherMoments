import React from 'react';
import CollectionEmpty from '~/uikit/collections/components/collectionEmpty';
import FlatButton from '~/uikit/buttons/components/flatButton';
import getUserDisplayName from '~/modules/users/helpers/getUserDisplayName';
import AnalyticsSidePanelContainer from '../containers/analyticsSidePanelContainer';
import { AnalyticsViewType, UserResponse } from '../analytics.types';

interface AnalyticsSidePanelProps {
  viewType: AnalyticsViewType;
  selectedResponse: UserResponse | null;
  selectedBlockResponseRef: string | null;
  onClose: () => void;
}

const AnalyticsSidePanel: React.FC<AnalyticsSidePanelProps> = ({
  viewType,
  selectedResponse,
  selectedBlockResponseRef,
  onClose
}) => {
  if (!selectedResponse) {
    return (
      <div className="h-full flex items-center justify-center">
        <CollectionEmpty
          attributes={{
            title: 'No response selected',
            body: 'Select a response to view it in the slide context'
          }}
        />
      </div>
    );
  }

  const title = viewType === 'byUserScenarios'
    ? selectedResponse.scenario?.name || 'Unknown scenario'
    : getUserDisplayName(selectedResponse.user);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">{title}</h3>
        <FlatButton icon="close" size="sm" onClick={onClose} />
      </div>
      <AnalyticsSidePanelContainer
        selectedResponse={selectedResponse}
        selectedBlockResponseRef={selectedBlockResponseRef}
      />
    </div>
  );
};

export default AnalyticsSidePanel;
