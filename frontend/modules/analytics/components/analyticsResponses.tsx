import React from 'react';
import map from 'lodash/map';
import AnalyticsResponsesItem from './analyticsResponsesItem';
import { AnalyticsViewType, UserResponse } from '../analytics.types';

interface AnalyticsResponsesProps {
  viewType: AnalyticsViewType;
  responses: UserResponse[];
}

const AnalyticsResponses: React.FC<AnalyticsResponsesProps> = ({
  viewType,
  responses
}) => {
  return (
    <div className="space-y-6">
      {map(responses, (response, index) => (
        <AnalyticsResponsesItem key={index} viewType={viewType} response={response} />
      ))}
    </div>
  );
};

export default AnalyticsResponses;
