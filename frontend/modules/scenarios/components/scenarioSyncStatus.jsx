import React from 'react';
import Icon from '~/uikit/icons/components/icon';

const ScenarioSyncStatus = ({
  syncType,
  isSyncing,
  hasSynced,
}) => {
  if (!isSyncing && !hasSynced) {
    return null;
  }

  return (
    <div className="flex items-center text-xs text-black/60 dark:text-white/60 w-36 border border-lm-2 dark:border-dm-2  rounded-md px-1 py-1">
      {isSyncing && (
        <>
          <Icon size="16" icon="syncing" className="mr-2 animate-spin" />
          {`Syncing ${syncType}`}
        </>
      )}
      {hasSynced && (
        <>
          <Icon size="16" icon="check" className="mr-2 text-green-500" />
          Changes saved
        </>
      )}
    </div>
  );
};

export default ScenarioSyncStatus;