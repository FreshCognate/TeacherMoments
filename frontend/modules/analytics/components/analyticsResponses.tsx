import React from 'react';
import map from 'lodash/map';
import AnalyticsResponsesItem from './analyticsResponsesItem';
import { AnalyticsViewType, UserResponse } from '../analytics.types';

interface AnalyticsResponsesProps {
  viewType: AnalyticsViewType;
  responses: UserResponse[];
  selectedBlockResponseRef: string | null;
  onResponseClicked: (response: UserResponse, blockResponseRef: string) => void;
}

const AnalyticsResponses: React.FC<AnalyticsResponsesProps> = ({
  viewType,
  responses,
  selectedBlockResponseRef,
  onResponseClicked
}) => {
  return (
    <div className="space-y-6">
      {map(responses, (response, index) => (
        <AnalyticsResponsesItem key={index} viewType={viewType} response={response} selectedBlockResponseRef={selectedBlockResponseRef} onResponseClicked={onResponseClicked} />
      ))}
    </div>
  );
};

export default AnalyticsResponses;
