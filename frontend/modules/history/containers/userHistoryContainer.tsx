import React, { Component } from 'react';
import UserHistory from '../components/userHistory';
import WithCache from '~/core/cache/containers/withCache';
import debounce from 'lodash/debounce';

class UserHistoryContainer extends Component {

  debounceFetch = debounce((fetch: () => void) => { fetch(); }, 800)

  onSearchValueChange = (searchValue: string) => {
    const { historyResponses } = this.props as any;
    historyResponses.setStatus('syncing');
    historyResponses.setQuery({ searchValue, currentPage: 1 });
    this.debounceFetch(historyResponses.fetch);
  }

  onPaginationClicked = (direction: string) => {
    const { historyResponses } = this.props as any;
    historyResponses.setStatus('syncing');
    let currentPage = historyResponses.query.currentPage;
    if (direction === 'up') {
      currentPage++;
    } else {
      currentPage--;
    }
    historyResponses.setQuery({ currentPage });
    historyResponses.fetch();
  }

  render() {

    const { historyResponses } = this.props as any;
    const { searchValue, currentPage } = historyResponses.query;
    const totalPages = historyResponses.response?.totalPages || 1;
    const user = historyResponses.response?.user;

    return (
      <UserHistory
        user={user}
        responses={historyResponses.data}
        isLoading={historyResponses.status === 'loading' || historyResponses.status === 'unresolved'}
        isSyncing={historyResponses.status === 'syncing'}
        searchValue={searchValue}
        currentPage={currentPage}
        totalPages={totalPages}
        onSearchValueChange={this.onSearchValueChange}
        onPaginationClicked={this.onPaginationClicked}
      />
    );
  }
};

export default WithCache(UserHistoryContainer, {
  historyResponses: {
    url: '/api/history',
    transform: ({ data }: any) => data.responses,
    getQuery: () => {
      return {
        searchValue: '',
        currentPage: 1
      };
    },
    getInitialData: () => ([])
  }
});
