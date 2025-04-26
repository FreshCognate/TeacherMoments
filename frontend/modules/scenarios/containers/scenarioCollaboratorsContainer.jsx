import React, { Component } from 'react';
import ScenarioCollaborators from '../components/scenarioCollaborators';
import WithCache from '~/core/cache/containers/withCache';
import getUserDisplayName from '~/modules/users/helpers/getUserDisplayName';
import getUserRole from '~/modules/users/helpers/getUserRole';
import addModal from '~/core/dialogs/helpers/addModal';
import AddCollaboratorsContainer from './addCollaboratorsContainer';
import map from 'lodash/map';
import axios from 'axios';
import handleRequestError from '~/core/app/helpers/handleRequestError';
import WithRouter from '~/core/app/components/withRouter';

class ScenarioCollaboratorsContainer extends Component {

  onActionClicked = ({ action }) => {
    if (action === 'ADD_COLLABORATOR') {
      addModal({
        title: 'Add collaborators',
        isFullScreen: true,
        component: <AddCollaboratorsContainer />,
        model: { selectedCollaborators: [] },
        actions: [{
          type: 'CANCEL',
          text: 'Cancel'
        }, {
          type: 'ADD',
          text: 'Add',
          color: 'primary'
        }]
      }, (state, { type, modal }) => {
        if (state === 'ACTION' && type === 'ADD' && modal.selectedCollaborators.length > 0) {

          this.props.scenario.setStatus('syncing');

          axios.put(`/api/scenarioCollaborators/${this.props.scenario.data._id}`, {
            setType: 'ADD',
            collaborators: map(modal.selectedCollaborators, '_id')
          }).then(() => {
            this.props.scenario.fetch();
          }).catch(handleRequestError);

        }
      })
    }
  }

  onItemActionClicked = ({ action, itemId }) => {
    if (action === 'REMOVE') {
      this.props.scenario.setStatus('syncing');
      axios.put(`/api/scenarioCollaborators/${this.props.scenario.data._id}`, {
        setType: 'REMOVE',
        collaborators: [itemId]
      }).then(() => {
        this.props.scenario.fetch();
      }).catch(handleRequestError);
    }
  }

  render() {

    const { collaborators } = this.props.scenario.data;

    const { status } = this.props.scenario;

    return (
      <ScenarioCollaborators
        collaborators={collaborators}
        getItemAttributes={(item) => {
          return {
            id: item.user._id,
            name: getUserDisplayName(item.user),
            meta: [{
              name: 'Email',
              value: item.user.email
            }, {
              name: 'Role',
              value: getUserRole(item)
            }]
          }
        }}
        getItemActions={(item) => {
          if (item.role === 'OWNER') return [];
          return [{
            action: 'REMOVE',
            text: 'Remove'
          }]
        }}
        actions={[{
          action: 'ADD_COLLABORATOR',
          text: 'Add collaborators'
        }]}
        isSyncing={status === 'syncing'}
        onActionClicked={this.onActionClicked}
        onItemActionClicked={this.onItemActionClicked}
      />
    );
  }
};

export default WithRouter(WithCache(ScenarioCollaboratorsContainer, null, ['scenario']));