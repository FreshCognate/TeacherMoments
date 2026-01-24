import React, { Component } from 'react';
import WithRouter from '~/core/app/components/withRouter';
import WithCache from '~/core/cache/containers/withCache';
import SlidePlayerContainer from '~/modules/slides/containers/slidePlayerContainer';
import get from 'lodash/get';
import find from 'lodash/find';
import filter from 'lodash/filter';
import navigateTo from '~/modules/run/helpers/navigateTo';
import getScenarioDetails from '~/modules/run/helpers/getScenarioDetails';

class PlayScenarioContainer extends Component {

  componentDidMount = () => {
    setTimeout(() => {
      this.startScenario();
    }, 0);
  }

  startScenario = () => {
    console.log(this.props);
    const { activeSlideId } = getScenarioDetails();

    console.log(activeSlideId);
    if (!activeSlideId) {
      navigateTo({ slideId: 'CONSENT', router: this.props.router });
      console.log('no selected slideId');
    }
    // if ('slideId' in this.props) {
    //   return;
    // }

    // const { isConsentAcknowledged, activeSlideRef } = this.props.run.data;

    // if (!isConsentAcknowledged) {
    //   navigateTo({ slideId: 'CONSENT', router: this.props.router });
    //   return;
    // }

    // const firstSlideRef = get(this.props, 'slides.data.0.ref', null);
    // const slideRef = activeSlideRef || firstSlideRef;

    // navigateTo({ slideRef, router: this.props.router });
  }

  getActiveSlide = () => {
    const { run, slides } = this.props;

    const { activeSlideId } = getScenarioDetails();

    if (activeSlideId === 'CONSENT') {
      return {
        _id: 'CONSENT_SLIDE',
        slideType: 'CONSENT'
      };
    }
    if (activeSlideId === 'SUMMARY') {
      return {
        _id: 'SUMMARY_SLIDE',
        slideType: 'SUMMARY'
      };
    }
    if (activeSlideId) {
      return find(slides.data, { ref: activeSlideId });
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