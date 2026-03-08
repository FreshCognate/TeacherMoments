import React, { Component } from 'react';
import map from 'lodash/map';
import AnalyticsResponsesTable from '../components/analyticsResponsesTable';
import { BlockColumn, UserResponse } from '../analytics.types';

interface AnalyticsResponsesTableContainerProps {
  responses: UserResponse[];
  selectedResponse: UserResponse | null;
  selectedBlockResponseRef: string | null;
  onResponseClicked: (response: UserResponse, blockResponseRef: string) => void;
  onSummarizeColumn: (blockColumn: BlockColumn) => void;
  onSummarizeScenario: () => void;
}

class AnalyticsResponsesTableContainer extends Component<AnalyticsResponsesTableContainerProps> {

  getBlockColumns = (): BlockColumn[] => {
    const { responses } = this.props;
    const firstResponse = responses[0];

    if (!firstResponse?.blockResponses?.length) return [];

    return map(firstResponse.blockResponses, (blockResponse) => ({
      ref: blockResponse.ref,
      slideRef: blockResponse.slideRef,
      slideName: blockResponse.slideName,
      slideSortOrder: blockResponse.slideSortOrder,
      name: blockResponse.name,
      blockType: blockResponse.blockType,
      inputType: blockResponse.inputType,
      sortOrder: blockResponse.sortOrder
    }));
  }

  render() {
    const { responses, selectedResponse, selectedBlockResponseRef, onResponseClicked, onSummarizeColumn, onSummarizeScenario } = this.props;
    const blockColumns = this.getBlockColumns();

    return (
      <AnalyticsResponsesTable
        responses={responses}
        blockColumns={blockColumns}
        selectedResponse={selectedResponse}
        selectedBlockResponseRef={selectedBlockResponseRef}
        onResponseClicked={onResponseClicked}
        onSummarizeColumn={onSummarizeColumn}
        onSummarizeScenario={onSummarizeScenario}
      />
    );
  }
}

export default AnalyticsResponsesTableContainer;
