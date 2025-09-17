import React, { Component } from 'react';
import WithRouter from '~/core/app/components/withRouter';
import WithCache from '~/core/cache/containers/withCache';
import SlidePlayerContainer from '~/modules/slides/containers/slidePlayerContainer';
import get from 'lodash/get';
import find from 'lodash/find';
import filter from 'lodash/filter';
import navigateTo from '~/modules/run/helpers/navigateTo';

class PlayScenarioContainer extends Component {

  componentDidMount = () => {
    setTimeout(() => {
      this.startScenario();
    }, 0);
  }

  startScenario = () => {
    const { activeSlideRef } = this.props.run.data;
    const firstSlideRef = get(this.props, 'slides.data.0.ref', null);

    const slideRef = activeSlideRef || firstSlideRef;

    navigateTo({ slideRef, router: this.props.router });

  }

  getActiveSlide = () => {
    let activeSlide = null;
    const { run, slides, scenario } = this.props;
    if (!run.data.isConsentAcknowledged) {
      return {
        _id: 'CONSENT_SLIDE',
        slideType: 'CONSENT'
      };
    }
    if (run.data.isComplete) {
      return {
        _id: 'SUMMARY_SLIDE',
        slideType: 'SUMMARY'
      };
    }
    if (run.data.activeSlideRef) {
      activeSlide = find(slides.data, { ref: run.data.activeSlideRef });
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

export default WithRouter(WithCache(PlayScenarioContainer, null, ['scenario', 'slides', 'blocks', 'run']));