import React from 'react';
import ActionBar from '~/uikit/actionBars/components/actionBar';
import map from 'lodash/map';
import Badge from '~/uikit/badges/components/badge';
import CollectionItem from './collectionItem';

const Collection = ({
  items,
  getItemAttributes,
  actions,
  searchValue,
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
  onSearchValueChange,
  onActionClicked,
  onPaginationClicked,
  onFiltersChanged,
  onSortByChanged
}) => {
  return (
    <div>
      <ActionBar
        //actions={actions}
        searchValue={searchValue}
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
      <div>
        {map(items, (item) => {
          const { id, name, meta } = getItemAttributes(item);
          return (
            <CollectionItem
              key={id}
              id={id}
              name={name}
              meta={meta}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Collection;