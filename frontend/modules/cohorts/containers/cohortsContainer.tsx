import React, { Component } from 'react';
import Cohorts from '../components/cohorts';
import addModal from '~/core/dialogs/helpers/addModal';
import axios from 'axios';
import WithCache from '~/core/cache/containers/withCache';
import handleRequestError from '~/core/app/helpers/handleRequestError';
import get from 'lodash/get';
import debounce from 'lodash/debounce';
import WithRouter from '~/core/app/components/withRouter';
import getCohortsActions from '../helpers/getCohortsActions';
import getCohortsFilters from '../helpers/getCohortsFilters';

interface CohortsContainerProps {
  cohorts: any,
  router: any
}

class CohortsContainer extends Component<CohortsContainerProps> {

  debounceFetch = debounce((fetch) => {
    fetch();
  }, 800)

  onActionClicked = ({ action }: { action: string }) => {
    switch (action) {
      case 'CREATE': {
        this.onCreateCohortClicked();
        break;
      }
    }
  }

  onCreateCohortClicked = () => {

    addModal({
      title: 'Create cohort',
      schema: {
        name: {
          type: 'Text',
          label: 'Cohort name',
          shouldAutoFocus: true
        },
      },
      model: {
        name: ''
      },
      actions: [{
        type: 'CANCEL',
        text: 'Cancel'
      }, {
        type: 'CREATE',
        text: 'Create',
        color: 'primary'
      }]
    }, (state: any, { type, modal }: any) => {
      if (state === 'ACTION') {
        if (type === 'CREATE') {
          axios.post('/api/cohorts', modal).then((response) => {
            const { cohort } = response.data;
            this.props.router.navigate(`/cohorts/${cohort._id}/overview`);
          }).catch(handleRequestError);
        }
      }
    })
  }

  onSearchValueChange = (searchValue: string) => {
    const { cohorts } = this.props;
    cohorts.setStatus('syncing');
    cohorts.setQuery({ searchValue, currentPage: 1 });
    this.debounceFetch(cohorts.fetch);
  }

  onFiltersChanged = (isArchived: string | boolean) => {
    const { cohorts } = this.props;
    cohorts.setStatus('syncing');
    cohorts.setQuery({ currentPage: 1, isArchived });
    cohorts.fetch();
  }

  onPaginationClicked = (direction: string) => {
    const { cohorts } = this.props;
    cohorts.setStatus('syncing');
    if (direction === 'up') {
      cohorts.setQuery({ currentPage: cohorts.query.currentPage + 1 });
    } else {
      cohorts.setQuery({ currentPage: cohorts.query.currentPage - 1 });
    }
    this.debounceFetch(cohorts.fetch);
  }

  onSortByChanged = (sortBy: string) => {
    const { cohorts } = this.props;
    cohorts.setStatus('syncing');
    cohorts.setQuery({ currentPage: 1, sortBy: sortBy });
    cohorts.fetch();
  }

  onDuplicateCohortClicked = (cohortId: string) => {
    const { cohorts } = this.props;
    cohorts.setStatus('syncing');
    axios.post(`/api/cohorts`, { cohortId }).then((response) => {
      const newCohortId = response.data.cohort._id;
      this.props.router.navigate(`/cohorts/${newCohortId}/overview`);
    }).catch(handleRequestError);
  }

  render() {

    const { query, status, data } = this.props.cohorts;

    const { searchValue, currentPage, sortBy, isArchived } = query;
    const totalPages = get(this.props, 'cohorts.response.totalPages', 1);
    const isSyncing = status === 'syncing';
    const isLoading = status === 'loading' || status === 'unresolved';

    return (
      <Cohorts
        cohorts={data}
        actions={getCohortsActions()}
        searchValue={searchValue}
        currentPage={currentPage}
        totalPages={totalPages}
        filter={isArchived}
        filters={getCohortsFilters()}
        sortBy={sortBy}
        sortByOptions={[{ value: 'NAME', text: 'Name' }, { value: 'NEWEST', text: 'Newest' }, { value: 'OLDEST', text: 'Oldest' }]}
        isSyncing={isSyncing}
        isLoading={isLoading}
        onActionClicked={this.onActionClicked}
        onSearchValueChange={this.onSearchValueChange}
        onFiltersChanged={this.onFiltersChanged}
        onPaginationClicked={this.onPaginationClicked}
        onSortByChanged={this.onSortByChanged}
        onDuplicateCohortClicked={this.onDuplicateCohortClicked}
      />
    );
  }
};

export default WithRouter(WithCache(CohortsContainer, {
  cohorts: {
    url: '/api/cohorts',
    transform: ({ data }: { data: any }) => data.cohorts,
    getQuery: ({ }) => {
      return {
        searchValue: '',
        currentPage: 1,
        sortBy: 'NAME',
        isArchived: false
      }
    }
  }
}));