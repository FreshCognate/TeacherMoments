import React from 'react';
import Collection from '~/uikit/collections/components/collection';
import Title from '~/uikit/content/components/title';
import map from 'lodash/map';
import getUserDisplayName from '~/modules/users/helpers/getUserDisplayName';
import Body from '~/uikit/content/components/body';
import FlatButton from '~/uikit/buttons/components/flatButton';

const AddCollaborators = ({
  availableCollaborators,
  selectedCollaborators,
  getItemAttributes,
  getItemActions,
  searchValue,
  currentPage,
  totalPages,
  isLoading,
  isSyncing,
  onSearchValueChange,
  onPaginationClicked,
  onItemActionClicked,
}) => {
  return (
    <div className="flex h-full pb-2 px-4">
      <div className="h-full w-full pr-4">
        <Collection
          items={availableCollaborators}
          getItemActions={getItemActions}
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
          onItemActionClicked={onItemActionClicked}
        />
      </div>
      <div className="h-full bg-lm-1 dark:bg-dm-1 rounded-lg p-4 max-w-60 w-full">
        <Title title="Selected collaborators" className="mb-4" />
        {(selectedCollaborators.length === 0) && (
          <div>
            <Body body="Select a collaborator to the list opposite." size="xs" className="text-black/40 dark:text-white/40" />
          </div>
        )}
        {(map(selectedCollaborators, (selectedCollaborator) => {
          return (
            <div
              key={selectedCollaborator._id}
              className="mb-2 p-2 rounded-md bg-lm-2 dark:bg-dm-2 "
            >
              <div>
                <Body
                  body={getUserDisplayName(selectedCollaborator)}
                  className="text-black/80 dark:text-white/80"
                />
                <Body
                  body={selectedCollaborator.email} size="xs"
                  className="text-black/40 dark:text-white/40"
                />
              </div>
              <div className="mt-2">
                <FlatButton icon="delete" text="Remove" size="sm" onClick={() => onItemActionClicked({ action: 'SELECT', itemId: selectedCollaborator._id })} />
              </div>
            </div>
          );
        }))}
      </div>
    </div>
  );
};

export default AddCollaborators;