import React from 'react';
import Collection from '~/uikit/collections/components/collection';

const ScenarioCollaborators = ({
  collaborators,
  getItemAttributes,
  actions,
  isSyncing,
  onActionClicked,
}) => {
  return (
    <div>
      <Collection
        items={collaborators}
        getItemAttributes={getItemAttributes}
        actions={actions}
        isSyncing={isSyncing}
        onActionClicked={onActionClicked}
      />
    </div>
  );
};

export default ScenarioCollaborators;