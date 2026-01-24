import React, { Component } from 'react';
import ScenarioSyncStatus from '../components/scenarioSyncStatus';
import WithCache from '~/core/cache/containers/withCache';

class ScenarioSyncStatusContainer extends Component {

  state = {
    hasSynced: false,
    wasSyncing: false,
  };

  componentDidUpdate() {
    const currentStatus = this.getSyncStatus();
    const isSyncing = currentStatus && currentStatus.isSyncing;

    if (isSyncing && !this.state.wasSyncing) {
      this.setState({ wasSyncing: true, hasSynced: false });
    } else if (!isSyncing && this.state.wasSyncing) {
      this.setState({ wasSyncing: false, hasSynced: true });
    }
  }

  getSyncStatus = () => {
    const { scenario, slides, slide, blocks, block, triggers } = this.props;
    if (triggers.status === 'syncing') {
      return {
        syncType: 'triggers',
        isSyncing: true
      }
    }
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
    const syncStatus = this.getSyncStatus();
    const { syncType, isSyncing } = syncStatus || {};
    const { hasSynced } = this.state;

    return (
      <ScenarioSyncStatus
        syncType={syncType}
        isSyncing={isSyncing}
        hasSynced={hasSynced}
      />
    );
  }
};

export default WithCache(ScenarioSyncStatusContainer, null, ['scenario', 'slides', 'slide', 'blocks', 'block', 'triggers']);