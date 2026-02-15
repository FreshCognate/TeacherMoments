import React, { Component } from 'react';
import AnalyticsContainer from '~/modules/analytics/containers/analyticsContainer';
import WithRouter from '~/core/app/components/withRouter';
import WithCache from '~/core/cache/containers/withCache';

class ScenarioResultsContainer extends Component {
  render() {

    const { scenarioResponses } = this.props;

    return (
      <AnalyticsContainer
        responses={scenarioResponses.data}
        isLoading={scenarioResponses.status === 'loading' || scenarioResponses.status === 'unresolved'}
      />
    );
  }
};

export default WithRouter(WithCache(ScenarioResultsContainer, {
  scenarioResponses: {
    url: '/api/responses',
    transform: ({ data }) => data.responses,
    getQuery: ({ props }) => {
      const { id } = props.router.params;
      return {
        scenarioId: id
      };
    },
    getInitialData: () => ([])
  }
}));
