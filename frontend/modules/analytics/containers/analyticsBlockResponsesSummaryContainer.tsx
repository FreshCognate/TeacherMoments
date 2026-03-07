import React, { Component } from 'react';
import AnalyticsBlockResponsesSummary from '../components/analyticsBlockResponsesSummary';
import { BlockColumn, UserResponse } from '../analytics.types';

interface AnalyticsBlockResponsesSummaryContainerProps {
  blockColumn: BlockColumn;
  responses: UserResponse[];
  actions?: any;
}

class AnalyticsBlockResponsesSummaryContainer extends Component<AnalyticsBlockResponsesSummaryContainerProps> {

  render() {
    const { blockColumn, responses } = this.props;

    return (
      <AnalyticsBlockResponsesSummary
        blockColumn={blockColumn}
        responses={responses}
      />
    );
  }
}

export default AnalyticsBlockResponsesSummaryContainer;
