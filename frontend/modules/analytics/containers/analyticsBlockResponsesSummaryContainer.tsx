import React, { Component } from 'react';
import WithRouter from '~/core/app/components/withRouter';
import WithCache from '~/core/cache/containers/withCache';
import AnalyticsBlockResponsesSummary from '../components/analyticsBlockResponsesSummary';
import { BlockColumn, UserResponse } from '../analytics.types';

interface AnalyticsBlockResponsesSummaryContainerProps {
  blockColumn: BlockColumn;
  responses: UserResponse[];
  actions?: any;
  router?: any;
  blockResponsesSummary?: any;
}

class AnalyticsBlockResponsesSummaryContainer extends Component<AnalyticsBlockResponsesSummaryContainerProps> {

  render() {
    const { blockColumn, responses, blockResponsesSummary } = this.props;

    return (
      <AnalyticsBlockResponsesSummary
        blockColumn={blockColumn}
        responses={responses}
        summary={blockResponsesSummary?.data?.summary || null}
        isLoading={blockResponsesSummary?.status === 'loading'}
      />
    );
  }
}

export default WithRouter(WithCache(AnalyticsBlockResponsesSummaryContainer, {
  blockResponsesSummary: {
    url: '/api/responses/summary',
    transform: ({ data }: any) => data,
    getQuery: ({ props }: any) => {
      const { id: cohortId, scenarioId } = props.router.params;
      return {
        cohortId,
        scenarioId,
        blockRef: props.blockColumn.ref
      };
    },
    getInitialData: () => ({})
  }
}));
