import React, { Component } from 'react';
import WithRouter from '~/core/app/components/withRouter';
import WithCache from '~/core/cache/containers/withCache';
import SlidePlayerContainer from '~/modules/slides/containers/slidePlayerContainer';

class PlayScenarioContainer extends Component {

  componentDidMount = () => {
    setTimeout(() => {
      this.startScenario();
    }, 0);
  }

  startScenario = () => {
    const firstSlideRef = get(this.props, 'slides.data.0.ref', null);
    navigateTo({ slideRef: firstSlideRef });
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
    const activeBlocks = this.getActiveBlocks(activeSlide);
    return (
      <div className="w-full max-w-md">
        <SlidePlayerContainer activeSlide={activeSlide} activeBlocks={activeBlocks} />
      </div>
    );
  }
};

export default WithRouter(WithCache(PlayScenarioContainer, {
  scenario: {
    url: '/api/play/:publishLink',
    getParams: ({ props }) => {
      console.log(props);
      return {};
    }
  },
  slides: {

  },
  blocks: {

  },
  tracking: {
    getInitialData: () => {
      return {
        activeSlideRef: null,
        stages: []
      }
    }
  }
}));