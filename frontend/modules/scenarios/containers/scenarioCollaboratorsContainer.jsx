import React, { Component } from 'react';
import ScenarioCollaborators from '../components/scenarioCollaborators';
import WithCache from '~/core/cache/containers/withCache';
import getUserDisplayName from '~/modules/users/helpers/getUserDisplayName';
import getUserRole from '~/modules/users/helpers/getUserRole';

class ScenarioCollaboratorsContainer extends Component {

  onActionClicked = ({ action }) => {
    console.log(action);
  }

  render() {

    const { collaborators } = this.props.scenario.data;

    return (
      <ScenarioCollaborators
        collaborators={collaborators}
        getItemAttributes={(item) => {
          return {
            id: item._id,
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
        actions={[{
          action: 'ADD_COLLABORATOR',
          text: 'Add collaborators'
        }]}
        onActionClicked={this.onActionClicked}
      />
    );
  }
};

export default WithCache(ScenarioCollaboratorsContainer, null, ['scenario']);