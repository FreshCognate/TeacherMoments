import React, { Component } from 'react';
import AddCollaborators from '../components/addCollaborators';
import getCache from '~/core/cache/helpers/getCache';
import WithCache from '~/core/cache/containers/withCache';
import getUserDisplayName from '~/modules/users/helpers/getUserDisplayName';
import debounce from 'lodash/debounce';
import cloneDeep from 'lodash/cloneDeep';
import remove from 'lodash/remove';
import find from 'lodash/find';

class AddCollaboratorsContainer extends Component {

  state = {
    selectedCollaborators: []
  }

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

  getItemActions = (item) => {
    if (find(this.state.selectedCollaborators, { _id: item._id })) {
      return [{
        text: 'Deselect',
        action: 'SELECT'
      }]
    } else {

      return [{
        text: 'Select',
        action: 'SELECT'
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

  onItemActionClicked = ({ itemId, action }) => {
    if (action === "SELECT") {
      const selectedCollaborators = cloneDeep(this.state.selectedCollaborators);
      const currentCollaborator = find(this.props.availableCollaborators.data, { _id: itemId });

      if (find(selectedCollaborators, { _id: itemId })) {
        remove(selectedCollaborators, { _id: itemId });
      } else {
        selectedCollaborators.push(currentCollaborator);
      }
      this.setState({ selectedCollaborators });
    }
  }

  render() {

    const { data, status, response } = this.props.availableCollaborators;
    const { searchValue, currentPage } = this.props.availableCollaborators.query;
    const totalPages = response?.totalPages || 1;
    const { selectedCollaborators } = this.state;

    return (
      <AddCollaborators
        availableCollaborators={data}
        selectedCollaborators={selectedCollaborators}
        getItemAttributes={this.getItemAttributes}
        getItemActions={this.getItemActions}
        isLoading={status === 'loading'}
        isSyncing={status === 'syncing'}
        searchValue={searchValue}
        currentPage={currentPage}
        totalPages={totalPages}
        onSearchValueChange={this.onSearchValueChange}
        onPaginationClicked={this.onPaginationClicked}
        onItemActionClicked={this.onItemActionClicked}
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