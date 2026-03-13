import React, { Component } from 'react';
import findIndex from 'lodash/findIndex';
import filter from 'lodash/filter';
import Analytics from '../components/analytics';
import getUserDisplayName from '~/modules/users/helpers/getUserDisplayName';
import addModal from '~/core/dialogs/helpers/addModal';
import addSidePanel from '~/core/dialogs/helpers/addSidePanel';
import AnalyticsBlockResponsesSummaryContainer from './analyticsBlockResponsesSummaryContainer';
import AnalyticsScenarioResponsesSummaryContainer from './analyticsScenarioResponsesSummaryContainer';
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
  selectedSlideRef: string | null;
  pendingUserSelection: 'first' | 'last' | null;
}

class AnalyticsContainer extends Component<AnalyticsContainerProps, AnalyticsContainerState> {

  state: AnalyticsContainerState = {
    selectedResponse: null,
    selectedBlockResponseRef: null,
    selectedSlideRef: null,
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
    this.setState({ selectedResponse: response, selectedBlockResponseRef: blockResponseRef, selectedSlideRef: null });
    this.scrollToBlockResponse(blockResponseRef);
  }

  onSlideNavigated = (slideRef: string) => {
    const { responses = [] } = this.props;

    this.setState((prevState) => {
      const response = prevState.selectedResponse || (responses.length > 0 ? responses[0] : null);
      const firstBlock = response?.blockResponses?.find((blockResponse) => blockResponse.slideRef === slideRef);

      if (firstBlock) this.scrollToBlockResponse(firstBlock.ref);

      return {
        selectedResponse: response,
        selectedSlideRef: slideRef,
        selectedBlockResponseRef: null
      };
    });
  }

  onBlockNavigated = (blockRef: string) => {
    const { responses = [] } = this.props;

    this.setState((prevState) => {
      const response = prevState.selectedResponse || (responses.length > 0 ? responses[0] : null);

      this.scrollToBlockResponse(blockRef);

      return {
        selectedResponse: response,
        selectedSlideRef: null,
        selectedBlockResponseRef: blockRef
      };
    });
  }

  onSidePanelClose = () => {
    this.setState({ selectedResponse: null, selectedBlockResponseRef: null, selectedSlideRef: null });
  }

  getBlockResponseCount = (blockColumn: BlockColumn) => {
    const { responses = [] } = this.props;
    return filter(responses, (response: UserResponse) => {
      const blockResponse = response.blockResponses?.find((br: any) => br.ref === blockColumn.ref);
      return blockResponse && (blockResponse.textValue || (blockResponse.selectedOptions && blockResponse.selectedOptions.length));
    }).length;
  }

  onSummarizeScenario = () => {
    const { responses = [] } = this.props;

    if (responses.length < 2) {
      addModal({
        title: 'Not enough responses',
        body: 'There must be at least 2 responses to generate a summary.',
        actions: [
          { type: 'CANCEL', text: 'OK' }
        ]
      }, () => {});
      return;
    }

    addModal({
      title: 'Summarize scenario',
      body: 'This will generate a summary of all responses across the entire scenario.',
      actions: [
        { type: 'CANCEL', text: 'Cancel' },
        { type: 'CONTINUE', text: 'Continue', color: 'primary' }
      ]
    }, (state: string, { type }: any) => {
      if (state === 'ACTION' && type === 'CONTINUE') {
        addSidePanel({
          size: 'lg',
          icon: 'ai',
          title: 'Scenario summary',
          component: <AnalyticsScenarioResponsesSummaryContainer scenarioName={this.props.scenario?.name} />
        });
      }
    });
  }

  onSummarizeColumn = (blockColumn: BlockColumn) => {
    const { responses = [] } = this.props;

    const responseCount = this.getBlockResponseCount(blockColumn);

    if (responseCount < 2) {
      addModal({
        title: 'Not enough responses',
        body: 'There must be at least 2 responses to generate a summary.',
        actions: [
          { type: 'CANCEL', text: 'OK' }
        ]
      }, () => {});
      return;
    }

    addModal({
      title: 'Summarize responses',
      body: 'This will generate a summary of responses in this column.',
      actions: [
        { type: 'CANCEL', text: 'Cancel' },
        { type: 'CONTINUE', text: 'Continue', color: 'primary' }
      ]
    }, (state: string, { type }: any) => {
      if (state === 'ACTION' && type === 'CONTINUE') {
        addSidePanel({
          size: 'lg',
          icon: 'ai',
          title: 'Prompt summary of responses',
          component: <AnalyticsBlockResponsesSummaryContainer blockColumn={blockColumn} responses={responses} />
        });
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

    const { selectedResponse, selectedBlockResponseRef, selectedSlideRef } = this.state;
    const { isUserUpDisabled, isUserDownDisabled } = this.getUserNavigationState();

    return (
      <Analytics
        viewType={viewType}
        scenarioId={scenario?._id}
        title={this.getTitle()}
        responses={responses || []}
        selectedResponse={selectedResponse}
        selectedBlockResponseRef={selectedBlockResponseRef}
        selectedSlideRef={selectedSlideRef}
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
        onBlockNavigated={this.onBlockNavigated}
        onUserNavigated={this.onUserNavigated}
        onSidePanelClose={this.onSidePanelClose}
        onSummarizeColumn={this.onSummarizeColumn}
        onSummarizeScenario={this.onSummarizeScenario}
      />
    );
  }
}

export default AnalyticsContainer;
