import React, { Component } from 'react';
import AnalyticsContainer from '~/modules/analytics/containers/analyticsContainer';
import WithRouter from '~/core/app/components/withRouter';
import WithCache from '~/core/cache/containers/withCache';
import triggerExport from '~/modules/analytics/helpers/triggerExport';
import debounce from 'lodash/debounce';

class CohortScenarioContainer extends Component {

  debounceFetch = debounce((fetch: () => void) => { fetch(); }, 800)

  onSearchValueChange = (searchValue: string) => {
    const { cohortScenarioResponses } = this.props as any;
    cohortScenarioResponses.setStatus('syncing');
    cohortScenarioResponses.setQuery({ searchValue, currentPage: 1 });
    this.debounceFetch(cohortScenarioResponses.fetch);
  }

  onExportClicked = () => {
    const { router } = this.props as any;
    const { id, scenarioId } = router.params;
    triggerExport({ exportType: 'COHORT_SCENARIO', scenarioId, cohortId: id });
  }

  onPaginationClicked = (direction: string) => {
    const { cohortScenarioResponses } = this.props as any;
    cohortScenarioResponses.setStatus('syncing');
    let currentPage = cohortScenarioResponses.query.currentPage;
    if (direction === 'up') {
      currentPage++;
    } else {
      currentPage--;
    }
    cohortScenarioResponses.setQuery({ currentPage });
    cohortScenarioResponses.fetch();
  }

  render() {

    const { cohortScenarioResponses } = this.props as any;
    const { searchValue, currentPage } = cohortScenarioResponses.query;
    const totalPages = cohortScenarioResponses.response?.totalPages || 1;
    const scenario = cohortScenarioResponses.response?.scenario;

    return (
      <AnalyticsContainer
        scenario={scenario}
        responses={cohortScenarioResponses.data}
        isLoading={cohortScenarioResponses.status === 'loading' || cohortScenarioResponses.status === 'unresolved'}
        isSyncing={cohortScenarioResponses.status === 'syncing'}
        searchValue={searchValue}
        currentPage={currentPage}
        totalPages={totalPages}
        onSearchValueChange={this.onSearchValueChange}
        onPaginationClicked={this.onPaginationClicked}
        onExportClicked={this.onExportClicked}
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
        scenarioId,
        searchValue: '',
        currentPage: 1
      };
    },
    getInitialData: () => ([])
  }
}));
