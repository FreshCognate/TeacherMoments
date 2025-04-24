import React from 'react';
import Collection from '~/uikit/collections/components/collection';

const ScenarioCollaborators = ({
  collaborators,
  getItemAttributes,
  actions,
  onActionClicked,
}) => {
  return (
    <div>
      <Collection
        items={collaborators}
        getItemAttributes={getItemAttributes}
        actions={actions}
        onActionClicked={onActionClicked}
      />
    </div>
  );
};

export default ScenarioCollaborators;