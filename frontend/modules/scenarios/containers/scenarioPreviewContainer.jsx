import React, { Component } from 'react';
import ScenarioPreview from '../components/scenarioPreview';
import get from 'lodash/get';
import find from 'lodash/find';
import filter from 'lodash/filter';
import WithCache from '~/core/cache/containers/withCache';
import navigateTo from '~/modules/run/helpers/navigateTo';

class ScenarioPreviewContainer extends Component {

  componentDidMount = () => {
    setTimeout(() => {
      navigateTo({ slideRef: this.props.slideRef });
    }, 0);
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.slideRef !== prevProps.slideRef) {
      navigateTo({ slideRef: this.props.slideRef });
    }
  }

  getActiveSlide = () => {
    let activeSlide = null;
    const { run, slides } = this.props;
    if (run.data.activeSlideRef) {
      activeSlide = find(slides.data, { ref: run.data.activeSlideRef });
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
  run: {
    getInitialData: () => {
      return {
        activeSlideRef: null,
        stages: []
      }
    }
  }
}, ['slides', 'blocks']);