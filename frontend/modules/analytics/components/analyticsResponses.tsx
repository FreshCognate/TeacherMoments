import React from 'react';
import map from 'lodash/map';
import AnalyticsResponsesItem from './analyticsResponsesItem';
import { AnalyticsViewType, UserResponse } from '../analytics.types';

interface AnalyticsResponsesProps {
  viewType: AnalyticsViewType;
  responses: UserResponse[];
  selectedResponse: UserResponse | null;
  selectedBlockResponseRef: string | null;
  selectedSlideRef: string | null;
  onResponseClicked: (response: UserResponse, blockResponseRef: string) => void;
  onSlideNavigated: (slideRef: string) => void;
  onBlockNavigated: (blockRef: string) => void;
}

const AnalyticsResponses: React.FC<AnalyticsResponsesProps> = ({
  viewType,
  responses,
  selectedResponse,
  selectedBlockResponseRef,
  selectedSlideRef,
  onResponseClicked,
  onSlideNavigated,
  onBlockNavigated
}) => {
  return (
    <div className="space-y-6">
      {map(responses, (response, index) => (
        <AnalyticsResponsesItem
          key={index}
          viewType={viewType}
          response={response}
          isSelected={response === selectedResponse}
          selectedBlockResponseRef={selectedBlockResponseRef}
          selectedSlideRef={selectedSlideRef}
          onResponseClicked={onResponseClicked}
          onSlideNavigated={onSlideNavigated}
          onBlockNavigated={onBlockNavigated}
        />
      ))}
    </div>
  );
};

export default AnalyticsResponses;
