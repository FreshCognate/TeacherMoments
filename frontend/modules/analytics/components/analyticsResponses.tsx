import React from 'react';
import map from 'lodash/map';
import AnalyticsResponsesItem from './analyticsResponsesItem';
import { UserResponse } from '../analytics.types';

interface AnalyticsResponsesProps {
  responses: UserResponse[];
}

const AnalyticsResponses: React.FC<AnalyticsResponsesProps> = ({
  responses
}) => {
  return (
    <div className="space-y-6">
      {map(responses, (response, index) => (
        <AnalyticsResponsesItem key={index} response={response} />
      ))}
    </div>
  );
};

export default AnalyticsResponses;
