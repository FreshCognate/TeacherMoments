import React from 'react';
import Icon from '~/uikit/icons/components/icon';

const ScenarioSyncStatus = ({
  syncType,
  isSyncing,
}) => {
  if (!isSyncing) return null
  return (
    <div className="flex items-center text-xs text-lm-4 dark:text-dm-4">
      <Icon size="16" icon="syncing" className="mr-2 animate-spin" />{`Syncing ${syncType}`}
    </div>
  );
};

export default ScenarioSyncStatus;