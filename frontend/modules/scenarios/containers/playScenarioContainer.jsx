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
    if ('slideId' in this.props) {
      return;
    }

    const { isConsentAcknowledged, activeSlideRef } = this.props.run.data;

    if (!isConsentAcknowledged) {
      navigateTo({ slideId: 'CONSENT', router: this.props.router });
      return;
    }

    const firstSlideRef = get(this.props, 'slides.data.0.ref', null);
    const slideRef = activeSlideRef || firstSlideRef;

    navigateTo({ slideRef, router: this.props.router });
  }

  getActiveSlide = () => {
    const { run, slides, slideId } = this.props;

    if (slideId === 'CONSENT') {
      return {
        _id: 'CONSENT_SLIDE',
        slideType: 'CONSENT'
      };
    }
    if (slideId === 'SUMMARY') {
      return {
        _id: 'SUMMARY_SLIDE',
        slideType: 'SUMMARY'
      };
    }
    if (run.data.activeSlideRef) {
      return find(slides.data, { ref: run.data.activeSlideRef });
    }
    return null;
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