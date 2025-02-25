import React, { Component } from 'react';
import ScenarioSettings from '../components/scenarioSettings';
import WithCache from '~/core/cache/containers/withCache';
import WithRouter from '~/core/app/components/withRouter';
import editScenarioSchema from '../schemas/editScenarioSchema';
import addModal from '~/core/dialogs/helpers/addModal';
import handleRequestError from '~/core/app/helpers/handleRequestError';
import axios from 'axios';

class ScenarioSettingsContainer extends Component {

  onUpdateScenario = ({ update }) => {
    return this.props.scenario.mutate(update, { method: 'put' });
  }

  onDeleteScenarioClicked = () => {
    addModal({
      title: 'Delete scenario',
      body: `Are you sure you would like to delete "${this.props.scenario.data.name}"?`,
      actions: [{
        type: 'CANCEL',
        text: 'Cancel'
      }, {
        type: 'DELETE',
        text: 'Delete',
        color: 'warning'
      }]
    }, (state, { type, modal }) => {
      if (state === 'ACTION') {
        if (type === 'DELETE') {
          axios.delete(`/api/scenarios/${this.props.scenario.data._id}`).then((response) => {
            this.props.router.navigate(`/scenarios`);
          }).catch(handleRequestError);
        }
      }
    })
  }

  render() {
    const { data, status } = this.props.scenario;
    return (
      <ScenarioSettings
        schema={editScenarioSchema}
        scenario={data}
        isLoading={status === 'loading' || status === 'unresolved'}
        onUpdateScenario={this.onUpdateScenario}
        onDeleteScenarioClicked={this.onDeleteScenarioClicked}
      />
    );
  }
};

export default WithRouter(WithCache(ScenarioSettingsContainer, null, ['scenario']));