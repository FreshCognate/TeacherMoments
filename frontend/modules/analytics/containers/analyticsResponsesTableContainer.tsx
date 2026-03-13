import React, { Component } from 'react';
import map from 'lodash/map';
import each from 'lodash/each';
import getBlockDisplayType from '~/modules/blocks/helpers/getBlockDisplayType';
import AnalyticsResponsesTable from '../components/analyticsResponsesTable';
import { BlockColumn, SlideGroup, UserResponse } from '../analytics.types';

interface AnalyticsResponsesTableContainerProps {
  responses: UserResponse[];
  selectedResponse: UserResponse | null;
  selectedBlockResponseRef: string | null;
  selectedSlideRef: string | null;
  onResponseClicked: (response: UserResponse, blockResponseRef: string) => void;
  onSlideNavigated: (slideRef: string) => void;
  onBlockNavigated: (blockRef: string) => void;
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

  getSlideGroups = (blockColumns: BlockColumn[]): SlideGroup[] => {
    const slideGroupMap: Record<string, SlideGroup> = {};
    const slideOrder: string[] = [];

    each(blockColumns, (blockColumn) => {
      const { slideRef } = blockColumn;

      if (!slideGroupMap[slideRef]) {
        slideGroupMap[slideRef] = {
          slideRef,
          slideName: blockColumn.slideName,
          slideSortOrder: blockColumn.slideSortOrder,
          promptColumns: [],
          firstBlockRef: blockColumn.ref
        };
        slideOrder.push(slideRef);
      }

      if (getBlockDisplayType(blockColumn) === 'PROMPT') {
        slideGroupMap[slideRef].promptColumns.push(blockColumn);
      }
    });

    return map(slideOrder, (slideRef) => slideGroupMap[slideRef]);
  }

  render() {
    const { responses, selectedResponse, selectedBlockResponseRef, selectedSlideRef, onResponseClicked, onSlideNavigated, onBlockNavigated, onSummarizeColumn, onSummarizeScenario } = this.props;
    const blockColumns = this.getBlockColumns();
    const slideGroups = this.getSlideGroups(blockColumns);

    return (
      <AnalyticsResponsesTable
        responses={responses}
        blockColumns={blockColumns}
        slideGroups={slideGroups}
        selectedResponse={selectedResponse}
        selectedBlockResponseRef={selectedBlockResponseRef}
        selectedSlideRef={selectedSlideRef}
        onResponseClicked={onResponseClicked}
        onSlideNavigated={onSlideNavigated}
        onBlockNavigated={onBlockNavigated}
        onSummarizeColumn={onSummarizeColumn}
        onSummarizeScenario={onSummarizeScenario}
      />
    );
  }
}

export default AnalyticsResponsesTableContainer;
