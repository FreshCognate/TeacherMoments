import React, { Component } from 'react';
import ScenarioSyncStatus from '../components/scenarioSyncStatus';
import WithCache from '~/core/cache/containers/withCache';

class ScenarioSyncStatusContainer extends Component {

  getSyncStatus = () => {
    const { scenario, slides, slide, blocks, block } = this.props;
    if (slide.status === 'syncing') {
      return {
        syncType: 'slide',
        isSyncing: true
      }
    }
    if (slides.status === 'syncing') {
      return {
        syncType: 'slides',
        isSyncing: true
      }
    }
    if (block.status === 'syncing') {
      return {
        syncType: 'block',
        isSyncing: true
      }
    }
    if (blocks.status === 'syncing') {
      return {
        syncType: 'blocks',
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

export default WithCache(ScenarioSyncStatusContainer, null, ['scenario', 'slides', 'slide', 'blocks', 'block']);