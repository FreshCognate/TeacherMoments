import React, { Component } from 'react';
import CohortScenarios from '../components/cohortScenarios';
import WithRouter from '~/core/app/components/withRouter';
import WithCache from '~/core/cache/containers/withCache';
import { Scenario } from '~/modules/scenarios/scenarios.types';
import debounce from 'lodash/debounce';
import axios from 'axios';
import openCreateScenarioModal from '~/modules/scenarios/helpers/openCreateScenarioModal';

interface CohortScenariosProps {
  cohortScenarios: {
    data: any,
    status: string,
    query: any,
    response: any,
    fetch: any,
    setQuery: any,
    setStatus: any
  }
  availableScenarios: {
    data: any,
    status: string,
    query: any,
    response: any
    fetch: any,
    setQuery: any,
    setStatus: any
  }
  router: any
}

class CohortScenariosContainer extends Component<CohortScenariosProps> {

  getItemAttributes = (item: Scenario) => {
    return {
      id: item._id,
      name: item.name,
      meta: []
    }
  }

  getAvailableScenariosItemActions = () => {
    return [{
      action: 'ADD',
      text: 'Add'
    }]
  }

  getAvailableScenariosEmptyAttributes = () => {
    return {
      title: 'No available scenarios',
      body: 'You have no available scenarios to choose from. Want to create a new one?',
      action: { text: 'Create a scenario', action: 'CREATE_SCENARIO' },
      help: "Looking for a scenario you've created? You need to make sure your scenario is published before it's available in a Cohort"
    }
  }

  onAvailableScenariosEmptyActionClicked = ({ action }: { action: string }) => {
    if (action === 'CREATE_SCENARIO') {
      openCreateScenarioModal({ router: this.props.router });
    }
  }

  debounceFetch = debounce((fetch) => fetch(), 1000)

  onAvailableScenariosSearchValueChange = (searchValue: string) => {
    this.props.availableScenarios.setStatus('syncing');
    this.props.availableScenarios.setQuery({ searchValue, currentPage: 1 });
    this.debounceFetch(this.props.availableScenarios.fetch);
  }

  onAvailableScenariosPaginationClicked = (action: string) => {
    const { setStatus, setQuery, fetch, query } = this.props.availableScenarios;
    setStatus('syncing');
    let currentPage = query.currentPage;
    if (action === 'up') {
      currentPage++;
    } else {
      currentPage--;
    }
    setQuery({ currentPage });
    fetch();
  }

  onAvailableScenariosItemActionClicked = ({ itemId, action }: { itemId: string, action: string }) => {
    if (action === 'ADD') {
      this.props.availableScenarios.setStatus('syncing');
      axios.put(`/api/cohorts/${this.props.router.params.id}`, {
        scenarioId: itemId,
        intent: 'ADD'
      }).then(() => {
        this.props.availableScenarios.fetch();
        this.props.cohortScenarios.fetch();
      });
    }
  }

  render() {

    const {
      status: availableScenariosStatus,
      query: availableScenariosQuery,
      data: availableScenariosData,
      response: availableScenariosResponse,
    } = this.props.availableScenarios;

    const {
      status: cohortScenariosStatus,
      query: cohortScenariosQuery,
      data: cohortScenariosData,
      response: cohortScenariosResponse,
    } = this.props.cohortScenarios;

    return (
      <CohortScenarios
        availableScenarios={availableScenariosData}
        availableScenariosSearchValue={availableScenariosQuery.searchValue}
        availableScenariosCurrentPage={availableScenariosQuery.currentPage}
        availableScenariosTotalPages={availableScenariosResponse?.totalPages || 1}
        availableScenariosIsLoading={availableScenariosStatus === 'loading' || availableScenariosStatus === 'unresolved'}
        availableScenariosIsSyncing={availableScenariosStatus === 'syncing'}
        getItemAttributes={this.getItemAttributes}
        getAvailableScenariosItemActions={this.getAvailableScenariosItemActions}
        getAvailableScenariosEmptyAttributes={this.getAvailableScenariosEmptyAttributes}
        onAvailableScenariosSearchValueChange={this.onAvailableScenariosSearchValueChange}
        onAvailableScenariosPaginationClicked={this.onAvailableScenariosPaginationClicked}
        onAvailableScenariosItemActionClicked={this.onAvailableScenariosItemActionClicked}
        onAvailableScenariosEmptyActionClicked={this.onAvailableScenariosEmptyActionClicked}
      />
    );
  }
};

export default WithRouter(WithCache(CohortScenariosContainer, {
  cohortScenarios: {
    url: '/api/cohortScenarios',
    transform: ({ data }: { data: { scenarios: Scenario[] } }) => data.scenarios,
    getQuery: ({ props }: { props: CohortScenariosProps }) => {
      return {
        cohortId: props.router.params.id
      }
    },
  },
  availableScenarios: {
    url: '/api/availableScenarios',
    transform: ({ data }: { data: { scenarios: Scenario[] } }) => data.scenarios,
    getQuery: ({ props }: { props: CohortScenariosProps }) => {
      return {
        cohortId: props.router.params.id
      }
    }
  }
}));