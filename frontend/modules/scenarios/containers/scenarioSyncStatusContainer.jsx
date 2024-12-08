import React, { Component } from 'react';
import ScenarioSyncStatus from '../components/scenarioSyncStatus';
import WithCache from '~/core/cache/containers/withCache';

class ScenarioSyncStatusContainer extends Component {

  getSyncStatus = () => {
    if (this.props.scenario.status === 'syncing') {
      return {
        syncType: 'scenario',
        isSyncing: true,
      }
    }
    return false;
  }

  render() {
    const { syncType, isSyncing } = this.getSyncStatus();
    return (
      <ScenarioSyncStatus
        syncType={syncType}
        isSyncing={isSyncing}
      />
    );
  }
};

export default WithCache(ScenarioSyncStatusContainer, null, ['scenario']);