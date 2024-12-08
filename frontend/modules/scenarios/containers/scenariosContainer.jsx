import React, { Component } from 'react';
import Scenarios from '../components/scenarios';
import addModal from '~/core/dialogs/helpers/addModal';
import axios from 'axios';
import WithCache from '~/core/cache/containers/withCache';
import handleRequestError from '~/core/app/helpers/handleRequestError';

class ScenariosContainer extends Component {

  onCreateScenarioClicked = () => {

    addModal({
      title: 'Create scenario',
      schema: {
        name: {
          type: 'Text',
          label: 'Scenario name'
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

  render() {
    return (
      <Scenarios
        scenarios={this.props.scenarios.data}
        onCreateScenarioClicked={this.onCreateScenarioClicked}
      />
    );
  }
};

export default WithCache(ScenariosContainer, {
  scenarios: {
    url: '/api/scenarios',
    transform: ({ data }) => data.scenarios,
  }
});