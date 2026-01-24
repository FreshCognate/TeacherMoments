export interface CollectionAction {
  action: string,
  text: string,
}

export interface CollectionFilter {
  value: string,
  text: string,
}

export interface CollectionSortByOption {
  value: string,
  text: string,
}

export interface CollectionMetaItem {
  value: string,
  text: string,
}

export interface CollectionEmptyAction {
  text: string,
  action: string,
}

export interface CollectionEmptyAttributes {
  title: string,
  body: string,
  action?: CollectionEmptyAction,
  help?: string,
}

export interface CollectionProps {
  items: any[],
  getItemActions?: (item: any) => void,
  getItemAttributes: (item: any) => { id: string, name: string, meta: CollectionMetaItem[] },
  getEmptyAttributes?: () => CollectionEmptyAttributes,
  actions?: CollectionAction[],
  searchValue?: string,
  searchPlaceholder?: string,
  currentPage?: number,
  totalPages?: number,
  filter?: string | boolean,
  filters?: CollectionFilter[],
  sortBy?: string,
  sortByOptions?: CollectionSortByOption[],
  hasSearch?: boolean,
  hasPagination: boolean,
  hasFilters?: boolean,
  hasSortBy?: boolean,
  isSyncing?: boolean,
  isLoading?: boolean,
  shouldAutoFocus?: boolean,
  onItemActionClicked?: ({ itemId, action }: { itemId: string, action: string }) => void,
  onSearchValueChange?: (searchValue: string) => void,
  onActionClicked?: ({ action }: { action: string }) => void,
  onPaginationClicked?: (action: string) => void,
  onFiltersChanged?: (value: string | boolean) => void,
  onSortByChanged?: (value: string) => void,
  onEmptyActionClicked?: ({ action }: { action: string }) => void
}