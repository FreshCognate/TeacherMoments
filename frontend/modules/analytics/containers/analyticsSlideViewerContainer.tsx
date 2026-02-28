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

interface AnalyticsSlideViewerContainerProps {
  selectedResponse: UserResponse;
  selectedBlockResponseRef: string | null;
  onSlideNavigated: (blockResponseRef: string) => void;
  previewSlides?: any;
  previewBlocks?: any;
}

class AnalyticsSlideViewerContainer extends Component<AnalyticsSlideViewerContainerProps> {

  getActiveSlide = () => {
    const { selectedBlockResponseRef, previewSlides, previewBlocks } = this.props;
    if (!selectedBlockResponseRef) return null;

    const selectedBlock = find(previewBlocks.data, { ref: selectedBlockResponseRef });
    if (!selectedBlock) return null;

    return find(previewSlides.data, { _id: selectedBlock.slideRef });
  }

  getActiveBlocks = (slideId: string) => {
    const { previewBlocks } = this.props;
    const slideBlocks = filter(previewBlocks.data, { slideRef: slideId });
    return sortBy(slideBlocks, 'sortOrder');
  }

  getResponseSlides = (): ResponseSlide[] => {
    const { previewSlides, previewBlocks } = this.props;
    const responseSlides: ResponseSlide[] = [];
    const sortedSlides = sortBy(previewSlides.data, 'sortOrder');

    each(sortedSlides, (slide: any) => {
      const slideBlocks = sortBy(filter(previewBlocks.data, { slideRef: slide._id }), 'sortOrder');
      if (slideBlocks.length > 0) {
        responseSlides.push({
          slideRef: slide._id,
          firstBlockRef: slideBlocks[0].ref
        });
      }
    });

    return responseSlides;
  }

  getCurrentSlideIndex = (responseSlides: ResponseSlide[]) => {
    const { selectedBlockResponseRef, previewBlocks } = this.props;
    if (!selectedBlockResponseRef) return -1;

    const selectedBlock = find(previewBlocks.data, { ref: selectedBlockResponseRef });
    if (!selectedBlock) return -1;

    return findIndex(responseSlides, { slideRef: selectedBlock.slideRef });
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

export default WithCache(AnalyticsSlideViewerContainer, {
  previewSlides: {
    url: '/api/play/slides',
    getInitialData: () => ([]),
    transform: ({ data }: any) => data.slides,
    getParams: ({ props }: any) => ({ scenario: props.selectedResponse.scenarioId }),
    getQuery: ({ props }: any) => ({ scenario: props.selectedResponse.scenarioId }),
    lifeTime: 0,
    staleTime: 0
  },
  previewBlocks: {
    url: '/api/play/blocks',
    getInitialData: () => ([]),
    transform: ({ data }: any) => data.blocks,
    getParams: ({ props }: any) => ({ scenario: props.selectedResponse.scenarioId }),
    getQuery: ({ props }: any) => ({ scenario: props.selectedResponse.scenarioId }),
    lifeTime: 0,
    staleTime: 0
  }
});
