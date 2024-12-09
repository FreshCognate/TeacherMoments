import React, { Component } from 'react';
import CreateScenario from '../components/createScenario';
import WithCache from '~/core/cache/containers/withCache';

class CreateScenarioContainer extends Component {
  render() {
    const { displayMode } = this.props.editor.data;
    return (
      <CreateScenario
        displayMode={displayMode}
      />
    );
  }
};

export default WithCache(CreateScenarioContainer, null, ['editor']);