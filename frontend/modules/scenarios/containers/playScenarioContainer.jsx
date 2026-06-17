import React, { Component } from 'react';
import WithRouter from '~/core/app/components/withRouter';
import WithCache from '~/core/cache/containers/withCache';
import SlidePlayerContainer from '~/modules/slides/containers/slidePlayerContainer';
import get from 'lodash/get';
import find from 'lodash/find';
import filter from 'lodash/filter';
import navigateTo from '~/modules/run/helpers/navigateTo';
import getScenarioDetails from '~/modules/run/helpers/getScenarioDetails';
import isSlideRefMissing from '~/modules/run/helpers/isSlideRefMissing';
import setScenarioToArchived from '~/modules/run/helpers/setScenarioToArchived';

class PlayScenarioContainer extends Component {

  componentDidMount = () => {
    setTimeout(() => {
      this.startScenario();
    }, 0);
  }

  startScenario = () => {

    const { activeSlideRef } = getScenarioDetails();
    const { isConsentAcknowledged, activeSlideRef: runSlideRef } = this.props.run.data;

    const targetSlideRef = activeSlideRef || runSlideRef;

    if (isSlideRefMissing({ slideRef: targetSlideRef, slides: this.props.slides.data })) {
      return this.restartScenario();
    }

    if (!activeSlideRef) {
      if (isConsentAcknowledged) {
        const firstSlideRef = get(this.props, 'slides.data.0.ref', null);
        const slideRef = runSlideRef || firstSlideRef;

        navigateTo({ slideRef, router: this.props.router });
      } else {
        navigateTo({ slideRef: 'CONSENT', router: this.props.router });
      }
    }

  }

  restartScenario = () => {
    setScenarioToArchived().then(() => {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.delete('slide');
      const search = searchParams.toString();

      window.location.href = search
        ? `${window.location.pathname}?${search}`
        : window.location.pathname;
    });
  }

  getActiveSlide = () => {
    const { slides } = this.props;

    const { activeSlideRef } = getScenarioDetails();

    if (activeSlideRef === 'CONSENT') {
      return {
        _id: 'CONSENT_SLIDE',
        slideType: 'CONSENT'
      };
    }
    if (activeSlideRef === 'SUMMARY') {
      return {
        _id: 'SUMMARY_SLIDE',
        slideType: 'SUMMARY'
      };
    }
    if (activeSlideRef) {
      return find(slides.data, { ref: activeSlideRef });
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