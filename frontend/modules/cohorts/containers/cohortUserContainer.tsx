import React, { Component } from 'react';
import AnalyticsContainer from '~/modules/analytics/containers/analyticsContainer';
import WithRouter from '~/core/app/components/withRouter';
import WithCache from '~/core/cache/containers/withCache';
import debounce from 'lodash/debounce';

class CohortUserContainer extends Component {

  debounceFetch = debounce((fetch: () => void) => { fetch(); }, 800)

  onSearchValueChange = (searchValue: string) => {
    const { cohortUserResponses } = this.props as any;
    cohortUserResponses.setStatus('syncing');
    cohortUserResponses.setQuery({ searchValue, currentPage: 1 });
    this.debounceFetch(cohortUserResponses.fetch);
  }

  onPaginationClicked = (direction: string) => {
    const { cohortUserResponses } = this.props as any;
    cohortUserResponses.setStatus('syncing');
    let currentPage = cohortUserResponses.query.currentPage;
    if (direction === 'up') {
      currentPage++;
    } else {
      currentPage--;
    }
    cohortUserResponses.setQuery({ currentPage });
    cohortUserResponses.fetch();
  }

  render() {

    const { cohortUserResponses } = this.props as any;
    const { searchValue, currentPage } = cohortUserResponses.query;
    const totalPages = cohortUserResponses.response?.totalPages || 1;
    const user = cohortUserResponses.response?.user;

    return (
      <AnalyticsContainer
        viewType="byUserScenarios"
        user={user}
        responses={cohortUserResponses.data}
        isLoading={cohortUserResponses.status === 'loading' || cohortUserResponses.status === 'unresolved'}
        isSyncing={cohortUserResponses.status === 'syncing'}
        searchValue={searchValue}
        currentPage={currentPage}
        totalPages={totalPages}
        onSearchValueChange={this.onSearchValueChange}
        onPaginationClicked={this.onPaginationClicked}
      />
    );
  }
};

export default WithRouter(WithCache(CohortUserContainer, {
  cohortUserResponses: {
    url: '/api/responses',
    transform: ({ data }: any) => data.responses,
    getQuery: ({ props }: any) => {
      const { id, userId } = props.router.params;
      return {
        cohortId: id,
        userId,
        searchValue: '',
        currentPage: 1
      };
    },
    getInitialData: () => ([])
  }
}));