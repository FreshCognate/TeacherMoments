import React, { Component } from 'react';
import Analytics from '../components/analytics';
import Loading from '~/uikit/loaders/components/loading';
import { UserResponse } from '../analytics.types';

interface AnalyticsContainerProps {
  responses?: UserResponse[];
  isLoading: boolean;
}

class AnalyticsContainer extends Component<AnalyticsContainerProps> {
  render() {
    const { responses, isLoading } = this.props;

    if (isLoading) {
      return (
        <div className="flex justify-center">
          <Loading />
        </div>
      );
    }

    if (!responses || responses.length === 0) {
      return (
        <div className="text-black/60 dark:text-white/60">
          No responses available
        </div>
      );
    }

    return (
      <Analytics responses={responses} />
    );
  }
}

export default AnalyticsContainer;
