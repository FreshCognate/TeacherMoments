import React, { Component } from 'react';
import Analytics from '../components/analytics';
import { UserResponse } from '../analytics.types';

interface AnalyticsContainerProps {
  responses?: UserResponse[];
  isLoading: boolean;
  isSyncing?: boolean;
  searchValue?: string;
  currentPage?: number;
  totalPages?: number;
  onSearchValueChange?: (searchValue: string) => void;
  onPaginationClicked?: (direction: string) => void;
}

class AnalyticsContainer extends Component<AnalyticsContainerProps> {
  render() {
    const {
      responses,
      isLoading,
      isSyncing,
      searchValue,
      currentPage,
      totalPages,
      onSearchValueChange,
      onPaginationClicked
    } = this.props;

    return (
      <Analytics
        responses={responses || []}
        isLoading={isLoading}
        isSyncing={isSyncing}
        searchValue={searchValue}
        currentPage={currentPage}
        totalPages={totalPages}
        onSearchValueChange={onSearchValueChange}
        onPaginationClicked={onPaginationClicked}
      />
    );
  }
}

export default AnalyticsContainer;
