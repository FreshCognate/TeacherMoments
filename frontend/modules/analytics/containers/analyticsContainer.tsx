import React, { Component } from 'react';
import Analytics from '../components/analytics';
import getUserDisplayName from '~/modules/users/helpers/getUserDisplayName';
import { AnalyticsViewType, UserResponse } from '../analytics.types';

interface AnalyticsContainerProps {
  viewType?: AnalyticsViewType;
  scenario?: any;
  user?: any;
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

  getTitle = () => {
    const { viewType = 'byScenarioUsers', scenario, user } = this.props;
    if (viewType === 'byUserScenarios') {
      return `User: ${getUserDisplayName(user)}`;
    }
    return scenario?.name ? `Scenario: ${scenario.name}` : undefined;
  }

  render() {
    const {
      viewType = 'byScenarioUsers',
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
        viewType={viewType}
        title={this.getTitle()}
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
