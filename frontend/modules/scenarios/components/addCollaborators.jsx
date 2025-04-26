import React from 'react';
import Collection from '~/uikit/collections/components/collection';
import Title from '~/uikit/content/components/title';

const AddCollaborators = ({
  availableCollaborators,
  getItemAttributes,
  isLoading,
  isSyncing,
}) => {
  return (
    <div className="flex h-full pb-2 px-4">
      <div className="h-full w-full pr-4">
        <Collection
          items={availableCollaborators}
          getItemAttributes={getItemAttributes}
          isLoading={isLoading}
          isSyncing={isSyncing}
          searchPlaceholder="Search collaborators..."
          hasSearch
          hasPagination
        />
      </div>
      <div className="h-full bg-lm-1 dark:bg-dm-1 rounded-lg p-4 max-w-60 w-full">
        <Title title="Selected collaborators" />
      </div>
    </div>
  );
};

export default AddCollaborators;