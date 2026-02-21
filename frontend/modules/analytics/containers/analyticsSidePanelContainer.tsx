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
  slides?: any;
  blocks?: any;
  scenario?: any;
}

class AnalyticsSidePanelContainer extends Component<AnalyticsSidePanelContainerProps> {

  getActiveSlide = () => {
    const { selectedResponse, selectedBlockResponseRef, slides } = this.props;
    if (!selectedBlockResponseRef) return null;

    const selectedBlockResponse = find(selectedResponse.blockResponses, { ref: selectedBlockResponseRef });
    if (!selectedBlockResponse) return null;

    return find(slides.data, { _id: selectedBlockResponse.slideRef });
  }

  getActiveBlocks = (slideId: string) => {
    const { blocks } = this.props;
    const slideBlocks = filter(blocks.data, { slideRef: slideId });
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
      />
    );
  }
}

export default WithCache(AnalyticsSidePanelContainer, {}, ['slides', 'blocks', 'scenario']);
