import React, { Component } from 'react';
import ScenarioSettings from '../components/scenarioSettings';
import WithCache from '~/core/cache/containers/withCache';
import WithRouter from '~/core/app/components/withRouter';

class ScenarioSettingsContainer extends Component {

  onUpdateScenario = ({ update }) => {
    return this.props.scenario.mutate(update, { method: 'put' });
  }

  render() {
    return (
      <ScenarioSettings
        scenario={this.props.scenario.data}
        onUpdateScenario={this.onUpdateScenario}
      />
    );
  }
};

export default WithRouter(WithCache(ScenarioSettingsContainer, null, ['scenario']));