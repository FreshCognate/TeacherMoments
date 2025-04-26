import React, { Component } from 'react';
import AddCollaborators from '../components/addCollaborators';
import getCache from '~/core/cache/helpers/getCache';
import WithCache from '~/core/cache/containers/withCache';
import getUserDisplayName from '~/modules/users/helpers/getUserDisplayName';
import debounce from 'lodash/debounce';

class AddCollaboratorsContainer extends Component {

  getItemAttributes = (item) => {
    return {
      id: item._id,
      name: getUserDisplayName(item),
      meta: [{
        name: 'Email',
        value: item.email
      }]
    }
  }

  debounceFetch = debounce((fetch) => fetch(), 1000)

  onSearchValueChange = (searchValue) => {
    this.props.availableCollaborators.setStatus('syncing');
    this.props.availableCollaborators.setQuery({ searchValue, currentPage: 1 });
    this.debounceFetch(this.props.availableCollaborators.fetch);
  }

  onPaginationClicked = (action) => {
    const { setStatus, setQuery, fetch, query } = this.props.availableCollaborators;
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

  render() {
    const { data, status, response } = this.props.availableCollaborators;
    const { searchValue, currentPage } = this.props.availableCollaborators.query;
    const totalPages = response?.totalPages || 1;
    return (
      <AddCollaborators
        availableCollaborators={data}
        getItemAttributes={this.getItemAttributes}
        isLoading={status === 'loading'}
        isSyncing={status === 'syncing'}
        searchValue={searchValue}
        currentPage={currentPage}
        totalPages={totalPages}
        onSearchValueChange={this.onSearchValueChange}
        onPaginationClicked={this.onPaginationClicked}
      />
    );
  }
};

export default WithCache(AddCollaboratorsContainer, {
  availableCollaborators: {
    url: '/api/scenarioCollaborators',
    transform: ({ data }) => data.collaborators,
    getQuery: ({ }) => {
      const scenarioId = getCache('scenario').data._id
      return {
        searchValue: '',
        currentPage: 1,
        scenarioId
      }
    }
  }
});