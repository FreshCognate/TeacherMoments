import React, { Component } from 'react';
import WithRouter from '~/core/app/components/withRouter';
import WithCache from '~/core/cache/containers/withCache';
import SlidePlayerContainer from '~/modules/slides/containers/slidePlayerContainer';
import get from 'lodash/get';
import find from 'lodash/find';
import filter from 'lodash/filter';
import navigateTo from '~/modules/tracking/helpers/navigateTo';
import { getCache } from '~/core/cache/helpers/cacheManager';

class PlayScenarioContainer extends Component {

  componentDidMount = () => {
    setTimeout(() => {
      this.startScenario();
    }, 0);
  }

  startScenario = () => {
    console.log('starting');
    console.log(this.props.slides.data);
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
    console.log(activeSlide, activeBlocks);
    return (
      <div className="w-full max-w-md mx-auto my-4">
        <SlidePlayerContainer activeSlide={activeSlide} activeBlocks={activeBlocks} />
      </div>
    );
  }
};

export default WithRouter(WithCache(PlayScenarioContainer, null, ['scenario', 'slides', 'blocks', 'tracking']));