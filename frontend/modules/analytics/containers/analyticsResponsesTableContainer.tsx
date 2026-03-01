import React, { Component } from 'react';
import WithCache from '~/core/cache/containers/withCache';
import sortBy from 'lodash/sortBy';
import map from 'lodash/map';
import find from 'lodash/find';
import AnalyticsResponsesTable from '../components/analyticsResponsesTable';
import { BlockColumn, UserResponse } from '../analytics.types';

interface AnalyticsResponsesTableContainerProps {
  scenarioId: string;
  responses: UserResponse[];
  selectedResponse: UserResponse | null;
  selectedBlockResponseRef: string | null;
  onResponseClicked: (response: UserResponse, blockResponseRef: string) => void;
  analyticsSlides?: any;
  analyticsBlocks?: any;
}

class AnalyticsResponsesTableContainer extends Component<AnalyticsResponsesTableContainerProps> {

  getBlockColumns = (): BlockColumn[] => {
    const { analyticsSlides, analyticsBlocks } = this.props;

    if (!analyticsSlides?.data?.length || !analyticsBlocks?.data?.length) return [];

    const blockColumns: BlockColumn[] = map(analyticsBlocks.data, (block: any) => {
      const slide = find(analyticsSlides.data, { _id: block.slideRef });
      return {
        ref: block.ref,
        slideRef: block.slideRef,
        slideName: slide?.name,
        slideSortOrder: slide?.sortOrder ?? 0,
        name: block.name,
        blockType: block.blockType,
        inputType: block.inputType,
        sortOrder: block.sortOrder
      };
    });

    return sortBy(blockColumns, ['slideSortOrder', 'sortOrder']);
  }

  render() {
    const { responses, selectedResponse, selectedBlockResponseRef, onResponseClicked } = this.props;
    const blockColumns = this.getBlockColumns();

    return (
      <AnalyticsResponsesTable
        responses={responses}
        blockColumns={blockColumns}
        selectedResponse={selectedResponse}
        selectedBlockResponseRef={selectedBlockResponseRef}
        onResponseClicked={onResponseClicked}
      />
    );
  }
}

export default WithCache(AnalyticsResponsesTableContainer, {
  analyticsSlides: {
    url: '/api/play/slides',
    getInitialData: () => ([]),
    transform: ({ data }: any) => data.slides,
    getParams: ({ props }: any) => ({ scenario: props.scenarioId }),
    getQuery: ({ props }: any) => ({ scenario: props.scenarioId }),
    lifeTime: 0,
    staleTime: 0
  },
  analyticsBlocks: {
    url: '/api/play/blocks',
    getInitialData: () => ([]),
    transform: ({ data }: any) => data.blocks,
    getParams: ({ props }: any) => ({ scenario: props.scenarioId }),
    getQuery: ({ props }: any) => ({ scenario: props.scenarioId }),
    lifeTime: 0,
    staleTime: 0
  }
});
