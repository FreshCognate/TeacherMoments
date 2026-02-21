import React, { Component } from 'react';
import WithCache from '~/core/cache/containers/withCache';
import find from 'lodash/find';
import filter from 'lodash/filter';
import sortBy from 'lodash/sortBy';
import each from 'lodash/each';
import AnalyticsSlideViewer from '../components/analyticsSlideViewer';
import { UserResponse } from '../analytics.types';

interface AnalyticsSidePanelContainerProps {
  selectedResponse: UserResponse;
  selectedBlockResponseRef: string | null;
  previewSlides?: any;
  previewBlocks?: any;
}

class AnalyticsSidePanelContainer extends Component<AnalyticsSidePanelContainerProps> {

  getActiveSlide = () => {
    const { selectedResponse, selectedBlockResponseRef, previewSlides } = this.props;
    if (!selectedBlockResponseRef) return null;

    const selectedBlockResponse = find(selectedResponse.blockResponses, { ref: selectedBlockResponseRef });
    if (!selectedBlockResponse) return null;

    return find(previewSlides.data, { _id: selectedBlockResponse.slideRef });
  }

  getActiveBlocks = (slideId: string) => {
    const { previewBlocks } = this.props;
    const slideBlocks = filter(previewBlocks.data, { slideRef: slideId });
    return sortBy(slideBlocks, 'sortOrder');
  }

  getBlockTrackingByRef = () => {
    const { selectedResponse } = this.props;
    const trackingByRef: Record<string, any> = {};

    each(selectedResponse.blockResponses, (blockResponse) => {
      trackingByRef[blockResponse.ref] = {
        selectedOptions: blockResponse.selectedOptions || [],
        textValue: blockResponse.textValue || '',
        audio: blockResponse.audio || null,
        isComplete: true,
        isAbleToComplete: true,
      };
    });

    return trackingByRef;
  }

  render() {
    const activeSlide = this.getActiveSlide();
    if (!activeSlide) return null;

    const activeBlocks = this.getActiveBlocks(activeSlide._id);
    const blockTrackingByRef = this.getBlockTrackingByRef();

    return (
      <AnalyticsSlideViewer
        activeSlide={activeSlide}
        activeBlocks={activeBlocks}
        blockTrackingByRef={blockTrackingByRef}
        selectedBlockResponseRef={this.props.selectedBlockResponseRef}
      />
    );
  }
}

export default WithCache(AnalyticsSidePanelContainer, {
  previewSlides: {
    url: '/api/slides',
    getInitialData: () => ([]),
    transform: ({ data }: any) => data.slides,
    getParams: ({ props }: any) => ({ scenarioId: props.selectedResponse.scenarioId }),
    getQuery: ({ props }: any) => ({ scenarioId: props.selectedResponse.scenarioId }),
    lifeTime: 0,
    staleTime: 0
  },
  previewBlocks: {
    url: '/api/blocks',
    getInitialData: () => ([]),
    transform: ({ data }: any) => data.blocks,
    getParams: ({ props }: any) => ({ scenarioId: props.selectedResponse.scenarioId }),
    getQuery: ({ props }: any) => ({ scenarioId: props.selectedResponse.scenarioId }),
    lifeTime: 0,
    staleTime: 0
  }
});
