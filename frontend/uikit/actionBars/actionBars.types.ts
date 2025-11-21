export interface ActionBarProps {
  actions?: Action[],
  searchValue?: string,
  searchPlaceholder?: string,
  currentPage?: number,
  totalPages?: number,
  filter?: string | boolean,
  filters?: Filter[],
  sortBy?: string,
  sortByOptions?: SortByOption[],
  hasSearch?: boolean,
  hasPagination?: boolean,
  hasFilters?: boolean,
  hasSortBy?: boolean,
  isSyncing?: boolean,
  isLoading?: boolean,
  shouldAutoFocus?: boolean,
  onSearchValueChange?: (searchValue: string) => void,
  onActionClicked?: ({ action }: { action: string }) => void,
  onPaginationClicked?: (direction: string) => void,
  onFiltersChanged?: (filter: string | boolean) => void,
  onSortByChanged?: (sortBy: string) => void
}

export interface Action {
  action: string,
  text: string,
  color?: string,
  getIsDisabled?: () => boolean
}

export interface Filter {
  value: string | boolean,
  text?: string,
  icon?: string
}

export interface SortByOption {
  value: string,
  text?: string,
  icon?: string,
}