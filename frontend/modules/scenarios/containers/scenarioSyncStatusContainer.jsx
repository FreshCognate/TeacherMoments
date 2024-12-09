import React, { Component } from 'react';
import ScenarioSyncStatus from '../components/scenarioSyncStatus';
import WithCache from '~/core/cache/containers/withCache';

class ScenarioSyncStatusContainer extends Component {

  getSyncStatus = () => {
    const { scenario, slides } = this.props;
    if (scenario.status === 'syncing') {
      return {
        syncType: 'scenario',
        isSyncing: true,
      }
    }
    if (slides.status === 'syncing') {
      return {
        syncType: 'slides',
        isSyncing: true
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

export default WithCache(ScenarioSyncStatusContainer, null, ['scenario', 'slides']);