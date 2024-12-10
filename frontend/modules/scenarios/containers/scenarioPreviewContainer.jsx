import React, { Component } from 'react';
import ScenarioPreview from '../components/scenarioPreview';
import get from 'lodash/get';
import find from 'lodash/find';
import filter from 'lodash/filter';
import WithCache from '~/core/cache/containers/withCache';

class ScenarioPreviewContainer extends Component {

  componentDidMount = () => {
    setTimeout(() => {
      this.startScenario();
    }, 0);
  }

  startScenario = () => {
    const firstSlideId = get(this.props, 'slides.data.0._id', null);
    this.props.tracking.set({ activeSlideId: firstSlideId })
  }

  getActiveSlide = () => {
    let activeSlide = null;
    const { tracking, slides } = this.props;
    if (tracking.data.activeSlideId) {
      activeSlide = find(slides.data, { _id: tracking.data.activeSlideId });
    }
    return activeSlide;
  }

  getActiveBlocks = (activeSlide) => {
    let activeBlocks = [];
    if (activeSlide) {
      activeBlocks = filter(this.props.blocks.data, { slide: activeSlide._id });
    }

    return activeBlocks;

  }

  render() {
    const activeSlide = this.getActiveSlide();
    return (
      <ScenarioPreview
        activeSlide={activeSlide}
        activeBlocks={this.getActiveBlocks(activeSlide)}
      />
    );
  }
};

export default WithCache(ScenarioPreviewContainer, {
  tracking: {
    getInitialData: () => {
      return {
        activeSlideId: null,
      }
    }
  }
}, ['slides', 'blocks']);