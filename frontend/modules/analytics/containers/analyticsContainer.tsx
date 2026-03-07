import React, { Component } from 'react';
import findIndex from 'lodash/findIndex';
import Analytics from '../components/analytics';
import getUserDisplayName from '~/modules/users/helpers/getUserDisplayName';
import addModal from '~/core/dialogs/helpers/addModal';
import { AnalyticsViewType, BlockColumn, UserResponse } from '../analytics.types';

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
  onExportClicked?: () => void;
}

interface AnalyticsContainerState {
  selectedResponse: UserResponse | null;
  selectedBlockResponseRef: string | null;
  pendingUserSelection: 'first' | 'last' | null;
}

class AnalyticsContainer extends Component<AnalyticsContainerProps, AnalyticsContainerState> {

  state: AnalyticsContainerState = {
    selectedResponse: null,
    selectedBlockResponseRef: null,
    pendingUserSelection: null
  }

  getTitle = () => {
    const { viewType = 'byScenarioUsers', scenario, user } = this.props;
    if (viewType === 'byUserScenarios') {
      return `User: ${getUserDisplayName(user)}`;
    }
    return scenario?.name ? `Scenario: ${scenario.name}` : undefined;
  }

  componentDidUpdate(prevProps: AnalyticsContainerProps) {
    const { responses = [] } = this.props;
    const { pendingUserSelection, selectedBlockResponseRef } = this.state;

    if (pendingUserSelection && responses.length > 0 && responses !== prevProps.responses) {
      const targetResponse = pendingUserSelection === 'first'
        ? responses[0]
        : responses[responses.length - 1];

      this.setState({
        selectedResponse: targetResponse,
        pendingUserSelection: null
      });

      if (selectedBlockResponseRef) {
        this.scrollToBlockResponse(selectedBlockResponseRef);
      }
    }
  }

  getUserNavigationState = () => {
    const { responses = [], currentPage = 1, totalPages = 1 } = this.props;
    const { selectedResponse } = this.state;

    if (!selectedResponse || responses.length === 0) {
      return { isUserUpDisabled: true, isUserDownDisabled: true };
    }

    const currentIndex = findIndex(responses, (r: UserResponse) => r.user?._id === selectedResponse.user?._id);

    return {
      isUserUpDisabled: currentIndex <= 0 && currentPage <= 1,
      isUserDownDisabled: currentIndex >= responses.length - 1 && currentPage >= totalPages
    };
  }

  onUserNavigated = (direction: string) => {
    const { responses = [], currentPage = 1, totalPages = 1, onPaginationClicked } = this.props;
    const { selectedResponse, selectedBlockResponseRef } = this.state;

    if (!selectedResponse || responses.length === 0) return;

    const currentIndex = findIndex(responses, (r: UserResponse) => r.user?._id === selectedResponse.user?._id);
    if (currentIndex === -1) return;

    if (direction === 'down') {
      if (currentIndex < responses.length - 1) {
        this.setState({ selectedResponse: responses[currentIndex + 1] });
        if (selectedBlockResponseRef) {
          this.scrollToBlockResponse(selectedBlockResponseRef);
        }
      } else if (currentPage < totalPages && onPaginationClicked) {
        this.setState({ pendingUserSelection: 'first' });
        onPaginationClicked('up');
      }
    } else {
      if (currentIndex > 0) {
        this.setState({ selectedResponse: responses[currentIndex - 1] });
        if (selectedBlockResponseRef) {
          this.scrollToBlockResponse(selectedBlockResponseRef);
        }
      } else if (currentPage > 1 && onPaginationClicked) {
        this.setState({ pendingUserSelection: 'last' });
        onPaginationClicked('down');
      }
    }
  }

  scrollToBlockResponse = (blockResponseRef: string) => {
    setTimeout(() => {
      const { selectedResponse } = this.state;
      const userId = selectedResponse?.user?._id;

      const element = userId
        ? document.querySelector(`[data-block-ref="${blockResponseRef}"][data-user-id="${userId}"]`) as HTMLElement
        : null;
      const fallbackElement = document.getElementById(`block-response-${blockResponseRef}`);

      const targetElement = element || fallbackElement;
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
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

  onSummarizeColumn = (blockColumn: BlockColumn) => {
    addModal({
      title: 'Summarize responses',
      body: 'This will generate a summary of responses in this column.',
      actions: [
        { type: 'CANCEL', text: 'Cancel' },
        { type: 'CONTINUE', text: 'Continue', color: 'primary' }
      ]
    }, (state: string, { type }: any) => {
      if (state === 'ACTION' && type === 'CONTINUE') {
        // Future: trigger summary generation
      }
    });
  }

  render() {
    const {
      viewType = 'byScenarioUsers',
      scenario,
      responses,
      isLoading,
      isSyncing,
      searchValue,
      currentPage,
      totalPages,
      onSearchValueChange,
      onPaginationClicked,
      onExportClicked
    } = this.props;

    const { selectedResponse, selectedBlockResponseRef } = this.state;
    const { isUserUpDisabled, isUserDownDisabled } = this.getUserNavigationState();

    return (
      <Analytics
        viewType={viewType}
        scenarioId={scenario?._id}
        title={this.getTitle()}
        responses={responses || []}
        selectedResponse={selectedResponse}
        selectedBlockResponseRef={selectedBlockResponseRef}
        isLoading={isLoading}
        isSyncing={isSyncing}
        searchValue={searchValue}
        currentPage={currentPage}
        totalPages={totalPages}
        isUserUpDisabled={isUserUpDisabled}
        isUserDownDisabled={isUserDownDisabled}
        onSearchValueChange={onSearchValueChange}
        onPaginationClicked={onPaginationClicked}
        onExportClicked={onExportClicked}
        onResponseClicked={this.onResponseClicked}
        onSlideNavigated={this.onSlideNavigated}
        onUserNavigated={this.onUserNavigated}
        onSidePanelClose={this.onSidePanelClose}
        onSummarizeColumn={this.onSummarizeColumn}
      />
    );
  }
}

export default AnalyticsContainer;
