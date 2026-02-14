import React, { Component } from 'react';
import Scenarios from '../components/scenarios';
import axios from 'axios';
import WithCache from '~/core/cache/containers/withCache';
import handleRequestError from '~/core/app/helpers/handleRequestError';
import get from 'lodash/get';
import debounce from 'lodash/debounce';
import WithRouter from '~/core/app/components/withRouter';
import getScenariosActions from '../helpers/getScenariosActions';
import openCreateScenarioModal from '../helpers/openCreateScenarioModal';

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
    const { scenarios } = this.props;
    scenarios.setStatus('syncing');
    axios.post(`/api/scenarios`, { scenarioId }).then((response) => {
      const newScenarioId = response.data.scenario._id;
      this.props.router.navigate(`/scenarios/${newScenarioId}/create`);
    }).catch(handleRequestError);
  }

  render() {

    const { query, status, data } = this.props.scenarios;

    const { searchValue, currentPage, accessType, sortBy } = query;
    const totalPages = get(this.props, 'scenarios.response.totalPages', 1);
    const isSyncing = status === 'syncing';
    const isLoading = status === 'loading' || status === 'unresolved';

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
        onSearchValueChange={this.onSearchValueChange}
        onPaginationClicked={this.onPaginationClicked}
        onCreateScenarioClicked={this.onCreateScenarioClicked}
        onFiltersChanged={this.onFiltersChanged}
        onSortByChanged={this.onSortByChanged}
        onDuplicateScenarioClicked={this.onDuplicateScenarioClicked}
        onActionClicked={this.onActionClicked}
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