import React from 'react';
import AnalyticsResponses from './analyticsResponses';
import { UserResponse } from '../analytics.types';

interface AnalyticsProps {
  responses: UserResponse[];
}

const Analytics: React.FC<AnalyticsProps> = ({
  responses
}) => {
  return (
    <AnalyticsResponses responses={responses} />
  );
};

export default Analytics;
