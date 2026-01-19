import React, { Component } from 'react';
import ScenarioPublishStatus from '../components/scenarioPublishStatus';
import WithCache from '~/core/cache/containers/withCache';
import WithRouter from '~/core/app/components/withRouter';

class ScenarioPublishStatusContainer extends Component {

  interval = null;

  componentDidMount = () => {
    this.interval = setInterval(() => {
      this.props.scenario.fetch();
    }, 3000);
  }

  componentWillUnmount = () => {
    clearInterval(this.interval);
  }

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