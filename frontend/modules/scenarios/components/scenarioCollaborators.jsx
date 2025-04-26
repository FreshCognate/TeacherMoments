import React from 'react';
import Collection from '~/uikit/collections/components/collection';

const ScenarioCollaborators = ({
  collaborators,
  getItemAttributes,
  getItemActions,
  actions,
  isSyncing,
  onActionClicked,
  onItemActionClicked
}) => {
  return (
    <div>
      <Collection
        items={collaborators}
        getItemAttributes={getItemAttributes}
        getItemActions={getItemActions}
        actions={actions}
        isSyncing={isSyncing}
        onActionClicked={onActionClicked}
        onItemActionClicked={onItemActionClicked}
      />
    </div>
  );
};

export default ScenarioCollaborators;