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
    const firstSlideRef = get(this.props, 'slides.data.0.ref', null);
    this.props.tracking.set({
      activeSlideRef: firstSlideRef,
      stages: [{
        slideRef: firstSlideRef,
        blocksByRef: {}
      }]
    })
  }

  getActiveSlide = () => {
    let activeSlide = null;
    const { tracking, slides } = this.props;
    if (tracking.data.activeSlideRef) {
      activeSlide = find(slides.data, { ref: tracking.data.activeSlideRef });
    }
    return activeSlide;
  }

  getActiveBlocks = (activeSlide) => {
    let activeBlocks = [];
    if (activeSlide) {
      activeBlocks = filter(this.props.blocks.data, { slideRef: activeSlide.ref });
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
        activeSlideRef: null,
      }
    }
  }
}, ['slides', 'blocks']);