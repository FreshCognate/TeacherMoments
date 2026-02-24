import React, { Component } from 'react';
import CohortCompletionStats from '../components/cohortCompletionStats';
import WithCache from '~/core/cache/containers/withCache';
import WithRouter from '~/core/app/components/withRouter';

interface CohortCompletionStatsContainerProps {
  cohortCompletionStats: {
    data: any,
    status: string,
  }
  router: any
}

class CohortCompletionStatsContainer extends Component<CohortCompletionStatsContainerProps> {
  render() {
    const { data, status } = this.props.cohortCompletionStats;
    return (
      <CohortCompletionStats
        totalUsers={data?.totalUsers || 0}
        cohortCompletionCount={data?.cohortCompletionCount || 0}
        isLoading={status === 'loading' || status === 'unresolved'}
      />
    );
  }
}

export default WithRouter(WithCache(CohortCompletionStatsContainer, {
  cohortCompletionStats: {
    url: '/api/cohortCompletionStats',
    getQuery: ({ props }: { props: CohortCompletionStatsContainerProps }) => {
      return {
        cohortId: props.router.params.id
      };
    },
  },
}));
