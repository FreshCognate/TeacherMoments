import React, { Component } from 'react';
import Scenarios from '../components/scenarios';
import WithCache from '~/core/cache/containers/withCache';
import get from 'lodash/get';
import debounce from 'lodash/debounce';
import WithRouter from '~/core/app/components/withRouter';
import getScenariosActions from '../helpers/getScenariosActions';
import openCreateScenarioModal from '../helpers/openCreateScenarioModal';
import openDuplicateScenarioModal from '../helpers/openDuplicateScenarioModal';
import getIsEditor from '~/modules/authentication/helpers/getIsEditor';

class ScenariosContainer extends Component {

  debounceFetch = debounce((fetch) => {
    fetch();
  }, 800)

  onActionClicked = ({ action }) => {
    switch (action) {
      case 'CREATE': {
        this.onCreateScenarioClicked();
        break;
      }
    }
  }

  onCreateScenarioClicked = () => {
    openCreateScenarioModal({ router: this.props.router });
  }

  onSearchValueChange = (searchValue) => {
    const { scenarios } = this.props;
    scenarios.setStatus('syncing');
    scenarios.setQuery({ searchValue, currentPage: 1 });
    this.debounceFetch(scenarios.fetch);
  }

  onPaginationClicked = (direction) => {
    const { scenarios } = this.props;
    scenarios.setStatus('syncing');
    if (direction === 'up') {
      scenarios.setQuery({ currentPage: scenarios.query.currentPage + 1 });
    } else {
      scenarios.setQuery({ currentPage: scenarios.query.currentPage - 1 });
    }
    this.debounceFetch(scenarios.fetch);
  }

  onFiltersChanged = (filter) => {
    const { scenarios } = this.props;
    scenarios.setStatus('syncing');
    scenarios.setQuery({ currentPage: 1, accessType: filter });
    scenarios.fetch();
  }

  onSortByChanged = (sortBy) => {
    const { scenarios } = this.props;
    scenarios.setStatus('syncing');
    scenarios.setQuery({ currentPage: 1, sortBy: sortBy });
    scenarios.fetch();
  }

  onDuplicateScenarioClicked = (scenarioId) => {
    openDuplicateScenarioModal({ scenarioId, router: this.props.router });
  }

  render() {

    const { query, status, data } = this.props.scenarios;

    const { searchValue, currentPage, accessType, sortBy } = query;
    const totalPages = get(this.props, 'scenarios.response.totalPages', 1);
    const isSyncing = status === 'syncing';
    const isLoading = status === 'loading' || status === 'unresolved';

    const isEditor = getIsEditor();

    return (
      <Scenarios
        scenarios={data}
        searchValue={searchValue}
        currentPage={currentPage}
        totalPages={totalPages}
        actions={getScenariosActions()}
        filter={accessType}
        filters={[{ value: '', text: 'All' }, { value: 'PUBLIC', text: 'Public' }, { value: 'PRIVATE', text: 'Private' }]}
        sortBy={sortBy}
        sortByOptions={[{ value: 'NAME', text: 'Name' }, { value: 'NEWEST', text: 'Newest' }, { value: 'OLDEST', text: 'Oldest' }]}
        isSyncing={isSyncing}
        isLoading={isLoading}
        isEditor={isEditor}
        onSearchValueChange={this.onSearchValueChange}
        onPaginationClicked={this.onPaginationClicked}
        onCreateScenarioClicked={this.onCreateScenarioClicked}
        onFiltersChanged={this.onFiltersChanged}
        onSortByChanged={this.onSortByChanged}
        onActionClicked={this.onActionClicked}
        onDuplicateScenarioClicked={this.onDuplicateScenarioClicked}
      />
    );
  }
};

export default WithRouter(WithCache(ScenariosContainer, {
  scenarios: {
    url: '/api/scenarios',
    transform: ({ data }) => data.scenarios,
    getInitialData: () => ([]),
    getQuery: ({ }) => {
      return {
        searchValue: '',
        currentPage: 1,
        accessType: '',
        sortBy: 'NAME'
      }
    }
  }
}));