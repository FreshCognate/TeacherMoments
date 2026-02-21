import React, { Component } from 'react';
import WithCache from '~/core/cache/containers/withCache';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import filter from 'lodash/filter';
import sortBy from 'lodash/sortBy';
import each from 'lodash/each';
import AnalyticsSlideViewer from '../components/analyticsSlideViewer';
import { UserResponse } from '../analytics.types';

interface ResponseSlide {
  slideRef: string;
  firstBlockRef: string;
}

interface AnalyticsSidePanelContainerProps {
  selectedResponse: UserResponse;
  selectedBlockResponseRef: string | null;
  onSlideNavigated: (blockResponseRef: string) => void;
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

  getResponseSlides = (): ResponseSlide[] => {
    const { selectedResponse } = this.props;
    const responseSlides: ResponseSlide[] = [];
    const seenSlideRefs = new Set<string>();

    each(selectedResponse.blockResponses, (blockResponse) => {
      if (!seenSlideRefs.has(blockResponse.slideRef)) {
        seenSlideRefs.add(blockResponse.slideRef);
        responseSlides.push({
          slideRef: blockResponse.slideRef,
          firstBlockRef: blockResponse.ref
        });
      }
    });

    return responseSlides;
  }

  getCurrentSlideIndex = (responseSlides: ResponseSlide[]) => {
    const { selectedResponse, selectedBlockResponseRef } = this.props;
    if (!selectedBlockResponseRef || !selectedResponse.blockResponses) return -1;

    const selectedBlockResponse = find(selectedResponse.blockResponses, { ref: selectedBlockResponseRef });
    if (!selectedBlockResponse) return -1;

    return findIndex(responseSlides, { slideRef: selectedBlockResponse.slideRef });
  }

  onBlockClicked = (blockRef: string) => {
    this.props.onSlideNavigated(blockRef);
  }

  onNavigateSlide = (direction: string) => {
    const responseSlides = this.getResponseSlides();
    const currentIndex = this.getCurrentSlideIndex(responseSlides);

    const newIndex = direction === 'up' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex < 0 || newIndex >= responseSlides.length) return;

    this.props.onSlideNavigated(responseSlides[newIndex].firstBlockRef);
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
    const responseSlides = this.getResponseSlides();
    const currentSlideIndex = this.getCurrentSlideIndex(responseSlides);

    return (
      <AnalyticsSlideViewer
        activeSlide={activeSlide}
        activeBlocks={activeBlocks}
        blockTrackingByRef={blockTrackingByRef}
        selectedBlockResponseRef={this.props.selectedBlockResponseRef}
        currentSlideIndex={currentSlideIndex}
        totalSlides={responseSlides.length}
        onNavigateSlide={this.onNavigateSlide}
        onBlockClicked={this.onBlockClicked}
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
