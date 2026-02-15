import React, { Component } from 'react';
import AnalyticsContainer from '~/modules/analytics/containers/analyticsContainer';
import WithRouter from '~/core/app/components/withRouter';
import WithCache from '~/core/cache/containers/withCache';

class CohortScenarioContainer extends Component {
  render() {

    const { cohortScenarioResponses } = this.props;

    return (
      <AnalyticsContainer
        responses={cohortScenarioResponses.data}
        isLoading={cohortScenarioResponses.status === 'loading' || cohortScenarioResponses.status === 'unresolved'}
      />
    );
  }
};

export default WithRouter(WithCache(CohortScenarioContainer, {
  cohortScenarioResponses: {
    url: '/api/responses',
    transform: ({ data }: any) => data.responses,
    getQuery: ({ props }: any) => {
      const { id, scenarioId } = props.router.params;
      return {
        cohortId: id,
        scenarioId
      }
    },
    getInitialData: () => ([])
  }
}));