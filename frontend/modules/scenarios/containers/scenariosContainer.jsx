import React, { Component } from 'react';
import Scenarios from '../components/scenarios';
import addModal from '~/core/dialogs/helpers/addModal';
import axios from 'axios';
import WithCache from '~/core/cache/containers/withCache';
import handleRequestError from '~/core/app/helpers/handleRequestError';
import get from 'lodash/get';
import debounce from 'lodash/debounce';

class ScenariosContainer extends Component {

  debounceFetch = debounce((fetch) => {
    fetch();
  }, 800)

  onCreateScenarioClicked = () => {

    addModal({
      title: 'Create scenario',
      schema: {
        name: {
          type: 'Text',
          label: 'Scenario name',
          shouldAutoFocus: true
        },
        accessType: {
          type: 'Toggle',
          label: 'Access type',
          options: [{
            value: 'PRIVATE',
            text: 'Private'
          }, {
            value: 'PUBLIC',
            text: 'Public'
          }]
        }
      },
      model: {
        name: '',
        accessType: 'PRIVATE'
      },
      actions: [{
        type: 'CANCEL',
        text: 'Cancel'
      }, {
        type: 'CREATE',
        text: 'Create',
        color: 'primary'
      }]
    }, (state, { type, modal }) => {
      if (state === 'ACTION') {
        if (type === 'CREATE') {
          axios.post('/api/scenarios', modal).then(() => {
            this.props.scenarios.fetch();
          }).catch(handleRequestError);
        }
      }
    })
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

  render() {

    const { query, status, data } = this.props.scenarios;

    const { searchValue, currentPage } = query;
    const totalPages = get(this.props, 'scenarios.response.totalPages', 1);
    const isSyncing = status === 'syncing';
    const isLoading = status === 'loading' || status === 'unresolved';

    return (
      <Scenarios
        scenarios={data}
        searchValue={searchValue}
        currentPage={currentPage}
        totalPages={totalPages}
        isSyncing={isSyncing}
        isLoading={isLoading}
        onSearchValueChange={this.onSearchValueChange}
        onPaginationClicked={this.onPaginationClicked}
        onCreateScenarioClicked={this.onCreateScenarioClicked}
      />
    );
  }
};

export default WithCache(ScenariosContainer, {
  scenarios: {
    url: '/api/scenarios',
    transform: ({ data }) => data.scenarios,
    getQuery: ({ }) => {
      return {
        searchValue: '',
        currentPage: 1
      }
    }
  }
});