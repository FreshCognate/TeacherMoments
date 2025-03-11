import React, { Component } from 'react';
import WithRouter from '~/core/app/components/withRouter';
import WithCache from '~/core/cache/containers/withCache';
import SlidePlayerContainer from '~/modules/slides/containers/slidePlayerContainer';
import get from 'lodash/get';
import find from 'lodash/find';
import filter from 'lodash/filter';
import navigateTo from '~/modules/tracking/helpers/navigateTo';

class PlayScenarioContainer extends Component {

  componentDidMount = () => {
    setTimeout(() => {
      this.startScenario();
    }, 0);
  }

  startScenario = () => {
    const { activeSlideRef } = this.props.tracking.data;
    const firstSlideRef = get(this.props, 'slides.data.0.ref', null);
    if (!activeSlideRef) {
      navigateTo({ slideRef: firstSlideRef });
    }
  }

  getActiveSlide = () => {
    let activeSlide = null;
    const { tracking, slides, scenario } = this.props;
    if (!tracking.data.isConsentAcknowledged) {
      return {
        _id: 'CONSENT_SLIDE',
        hasNavigateBack: false,
        slideType: 'CONSENT',
        children: []
      };
    }
    if (tracking.data.activeSlideRef) {
      activeSlide = find(slides.data, { ref: tracking.data.activeSlideRef });
    }
    return activeSlide;
  }

  getActiveBlocks = (activeSlide) => {
    let activeBlocks = [];
    const { blocks } = this.props;
    if (activeSlide) {
      activeBlocks = filter(blocks.data, { slideRef: activeSlide.ref });
    }

    return activeBlocks;

  }

  render() {

    const activeSlide = this.getActiveSlide();
    const activeBlocks = this.getActiveBlocks(activeSlide);

    return (
      <div className="w-full max-w-md mx-auto my-4">
        <SlidePlayerContainer scenario={this.props.scenario.data} activeSlide={activeSlide} activeBlocks={activeBlocks} />
      </div>
    );
  }
};

export default WithRouter(WithCache(PlayScenarioContainer, null, ['scenario', 'slides', 'blocks', 'tracking']));