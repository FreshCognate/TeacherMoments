import React, { Component } from 'react';
import AnalyticsContainer from '~/modules/analytics/containers/analyticsContainer';
import WithRouter from '~/core/app/components/withRouter';
import WithCache from '~/core/cache/containers/withCache';
import debounce from 'lodash/debounce';

class ScenarioResponsesContainer extends Component {

  debounceFetch = debounce((fetch) => { fetch(); }, 800)

  onSearchValueChange = (searchValue) => {
    const { scenarioResponses } = this.props;
    scenarioResponses.setStatus('syncing');
    scenarioResponses.setQuery({ searchValue, currentPage: 1 });
    this.debounceFetch(scenarioResponses.fetch);
  }

  onPaginationClicked = (direction) => {
    const { scenarioResponses } = this.props;
    scenarioResponses.setStatus('syncing');
    let currentPage = scenarioResponses.query.currentPage;
    if (direction === 'up') {
      currentPage++;
    } else {
      currentPage--;
    }
    scenarioResponses.setQuery({ currentPage });
    scenarioResponses.fetch();
  }

  render() {

    const { scenarioResponses } = this.props;
    const { searchValue, currentPage } = scenarioResponses.query;
    const totalPages = scenarioResponses.response?.totalPages || 1;
    const scenario = scenarioResponses.response?.scenario;

    return (
      <div className="pt-4">
        <AnalyticsContainer
          scenario={scenario}
          responses={scenarioResponses.data}
          isLoading={scenarioResponses.status === 'loading' || scenarioResponses.status === 'unresolved'}
          isSyncing={scenarioResponses.status === 'syncing'}
          searchValue={searchValue}
          currentPage={currentPage}
          totalPages={totalPages}
          onSearchValueChange={this.onSearchValueChange}
          onPaginationClicked={this.onPaginationClicked}
        />
      </div>
    );
  }
};

export default WithRouter(WithCache(ScenarioResponsesContainer, {
  scenarioResponses: {
    url: '/api/responses',
    transform: ({ data }) => data.responses,
    getQuery: ({ props }) => {
      const { id } = props.router.params;
      return {
        scenarioId: id,
        searchValue: '',
        currentPage: 1
      };
    },
    getInitialData: () => ([])
  }
}));
