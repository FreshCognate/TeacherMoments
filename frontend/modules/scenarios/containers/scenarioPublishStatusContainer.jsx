import React, { Component } from 'react';
import ScenarioPublishStatus from '../components/scenarioPublishStatus';
import WithCache from '~/core/cache/containers/withCache';
import WithRouter from '~/core/app/components/withRouter';

class ScenarioPublishStatusContainer extends Component {
  render() {
    const { _id, hasChanges } = this.props.scenario.data;
    return (
      <ScenarioPublishStatus
        scenarioId={_id}
        hasChanges={hasChanges}
      />
    );
  }
};

export default WithRouter(WithCache(ScenarioPublishStatusContainer, {}, ['scenario']));