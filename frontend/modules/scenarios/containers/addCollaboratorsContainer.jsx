import React, { Component } from 'react';
import AddCollaborators from '../components/addCollaborators';
import getCache from '~/core/cache/helpers/getCache';
import WithCache from '~/core/cache/containers/withCache';
import getUserDisplayName from '~/modules/users/helpers/getUserDisplayName';
import getUserRole from '~/modules/users/helpers/getUserRole';

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

  render() {
    const { data, status } = this.props.availableCollaborators;
    return (
      <AddCollaborators
        availableCollaborators={data}
        getItemAttributes={this.getItemAttributes}
        isLoading={status === 'loading'}
        isSyncing={status === 'syncing'}
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