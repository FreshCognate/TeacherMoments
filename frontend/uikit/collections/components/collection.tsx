import React from 'react';
import ActionBar from '~/uikit/actionBars/components/actionBar';
import map from 'lodash/map';
import CollectionItem from './collectionItem';
import CollectionEmpty from './collectionEmpty';
import { CollectionProps } from '../collections.types';

const Collection = ({
  items,
  getItemActions,
  getItemAttributes,
  getEmptyAttributes,
  actions,
  searchValue,
  searchPlaceholder,
  currentPage,
  totalPages,
  filter,
  filters,
  sortBy,
  sortByOptions,
  hasSearch,
  hasPagination,
  hasFilters,
  hasSortBy,
  isSyncing,
  isLoading,
  shouldAutoFocus,
  onItemActionClicked,
  onSearchValueChange,
  onActionClicked,
  onPaginationClicked,
  onFiltersChanged,
  onSortByChanged,
  onEmptyActionClicked
}: CollectionProps) => {
  const isEmpty = !isLoading && (!items || items.length === 0);
  const emptyAttributes = isEmpty && getEmptyAttributes ? getEmptyAttributes() : null;
  return (
    <div className="pt-4">
      <div className="mb-4">
        <ActionBar
          actions={actions}
          searchValue={searchValue}
          searchPlaceholder={searchPlaceholder}
          currentPage={currentPage}
          totalPages={totalPages}
          filter={filter}
          filters={filters}
          sortBy={sortBy}
          sortByOptions={sortByOptions}
          hasSearch={hasSearch}
          hasPagination={hasPagination}
          hasFilters={hasFilters}
          hasSortBy={hasSortBy}
          isSyncing={isSyncing}
          isLoading={isLoading}
          shouldAutoFocus={shouldAutoFocus}
          onSearchValueChange={onSearchValueChange}
          onActionClicked={onActionClicked}
          onPaginationClicked={onPaginationClicked}
          onFiltersChanged={onFiltersChanged}
          onSortByChanged={onSortByChanged}
        />
      </div>
      <div>
        {isEmpty && emptyAttributes ? (
          <CollectionEmpty
            attributes={emptyAttributes}
            onActionClicked={onEmptyActionClicked}
          />
        ) : (
          map(items, (item: any) => {
            const { id, name, meta } = getItemAttributes(item);
            const itemActions = getItemActions ? getItemActions(item) : {};
            return (
              <CollectionItem
                key={id}
                id={id}
                name={name}
                meta={meta}
                actions={itemActions}
                onActionClicked={onItemActionClicked}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default Collection;