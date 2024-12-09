import React, { Component } from 'react';
import ScenarioSettings from '../components/scenarioSettings';
import WithCache from '~/core/cache/containers/withCache';
import WithRouter from '~/core/app/components/withRouter';
import editScenarioSchema from '../schemas/editScenarioSchema';

class ScenarioSettingsContainer extends Component {

  onUpdateScenario = ({ update }) => {
    return this.props.scenario.mutate(update, { method: 'put' });
  }

  render() {
    const { data, status } = this.props.scenario;
    return (
      <ScenarioSettings
        schema={editScenarioSchema}
        scenario={data}
        isLoading={status === 'loading' || status === 'unresolved'}
        onUpdateScenario={this.onUpdateScenario}
      />
    );
  }
};

export default WithRouter(WithCache(ScenarioSettingsContainer, null, ['scenario']));