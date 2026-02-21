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

interface AnalyticsContainerState {
  selectedResponse: UserResponse | null;
  selectedBlockResponseRef: string | null;
}

class AnalyticsContainer extends Component<AnalyticsContainerProps, AnalyticsContainerState> {

  state: AnalyticsContainerState = {
    selectedResponse: null,
    selectedBlockResponseRef: null
  }

  getTitle = () => {
    const { viewType = 'byScenarioUsers', scenario, user } = this.props;
    if (viewType === 'byUserScenarios') {
      return `User: ${getUserDisplayName(user)}`;
    }
    return scenario?.name ? `Scenario: ${scenario.name}` : undefined;
  }

  scrollToBlockResponse = (blockResponseRef: string) => {
    setTimeout(() => {
      const element = document.getElementById(`block-response-${blockResponseRef}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 0);
  }

  onResponseClicked = (response: UserResponse, blockResponseRef: string) => {
    this.setState({ selectedResponse: response, selectedBlockResponseRef: blockResponseRef });
    this.scrollToBlockResponse(blockResponseRef);
  }

  onSlideNavigated = (blockResponseRef: string) => {
    this.setState({ selectedBlockResponseRef: blockResponseRef });
    this.scrollToBlockResponse(blockResponseRef);
  }

  onSidePanelClose = () => {
    this.setState({ selectedResponse: null, selectedBlockResponseRef: null });
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

    const { selectedResponse, selectedBlockResponseRef } = this.state;

    return (
      <Analytics
        viewType={viewType}
        title={this.getTitle()}
        responses={responses || []}
        selectedResponse={selectedResponse}
        selectedBlockResponseRef={selectedBlockResponseRef}
        isLoading={isLoading}
        isSyncing={isSyncing}
        searchValue={searchValue}
        currentPage={currentPage}
        totalPages={totalPages}
        onSearchValueChange={onSearchValueChange}
        onPaginationClicked={onPaginationClicked}
        onResponseClicked={this.onResponseClicked}
        onSlideNavigated={this.onSlideNavigated}
        onSidePanelClose={this.onSidePanelClose}
      />
    );
  }
}

export default AnalyticsContainer;
