import React from 'react';
import Collection from '~/uikit/collections/components/collection';
import Title from '~/uikit/content/components/title';

const AddCollaborators = ({
  availableCollaborators,
  getItemAttributes,
  searchValue,
  currentPage,
  totalPages,
  isLoading,
  isSyncing,
  onSearchValueChange,
  onPaginationClicked
}) => {
  return (
    <div className="flex h-full pb-2 px-4">
      <div className="h-full w-full pr-4">
        <Collection
          items={availableCollaborators}
          getItemAttributes={getItemAttributes}
          searchPlaceholder="Search collaborators..."
          searchValue={searchValue}
          currentPage={currentPage}
          totalPages={totalPages}
          hasSearch
          hasPagination
          isLoading={isLoading}
          isSyncing={isSyncing}
          onSearchValueChange={onSearchValueChange}
          onPaginationClicked={onPaginationClicked}
        />
      </div>
      <div className="h-full bg-lm-1 dark:bg-dm-1 rounded-lg p-4 max-w-60 w-full">
        <Title title="Selected collaborators" />
      </div>
    </div>
  );
};

export default AddCollaborators;