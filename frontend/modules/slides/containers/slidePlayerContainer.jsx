import React, { Component } from 'react';
import SlidePlayer from '../components/slidePlayer';
import updateTracking from '~/modules/tracking/helpers/updateTracking';
import navigateTo from '~/modules/tracking/helpers/navigateTo';
import trigger from '~/modules/triggers/helpers/trigger';
import getSlideTracking from '~/modules/tracking/helpers/getSlideTracking';
import WithCache from '~/core/cache/containers/withCache';
import navigateBack from '~/modules/tracking/helpers/navigateBack';
import getIsAbleToCompleteSlide from '~/modules/tracking/helpers/getIsAbleToCompleteSlide';

class SlidePlayerContainer extends Component {

  state = {
    isLoading: true
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.activeSlide !== prevProps.activeSlide) {
      trigger({ triggerType: 'SLIDE', event: 'ON_ENTER', elementRef: this.props.activeSlide.ref }, {}).then(() => {
        this.setState({ isLoading: false });
      });
    }
  }

  getNavigationDetails = () => {
    let hasBackButton = true;
    let hasNextButton = true;
    let isNextButtonActive = false;
    if (this.props.activeSlide?.isRoot) {
      hasBackButton = false;
    }
    if (this.props.activeSlide?.children.length === 0) {
      hasNextButton = false;
    }

    const isAbleToCompleteSlide = getIsAbleToCompleteSlide();

    if (isAbleToCompleteSlide) {
      isNextButtonActive = true;
    }
    return {
      hasBackButton,
      hasNextButton,
      isNextButtonActive
    }
  }

  onUpdateTracking = async ({ blockRef, update }) => {
    await updateTracking({ slideRef: this.props.activeSlide.ref, blockRef, update });
  }

  onPreviousSlideClicked = () => {
    return navigateBack();
  }

  onNextSlideClicked = () => {
    return navigateTo({ slideRef: this.props.activeSlide.children[0] });
  }

  navigateTo = ({ slideRef }) => {
    return navigateTo({ slideRef });
  }

  render() {

    const { activeSlide, activeBlocks } = this.props;

    const slideTracking = getSlideTracking();

    const { hasBackButton, hasNextButton, isNextButtonActive } = this.getNavigationDetails();

    return (
      <SlidePlayer
        activeSlide={activeSlide}
        activeBlocks={activeBlocks}
        isLoading={this.state.isLoading}
        navigateTo={this.navigateTo}
        tracking={slideTracking}
        hasBackButton={hasBackButton}
        hasNextButton={hasNextButton}
        isNextButtonActive={isNextButtonActive}
        onUpdateTracking={this.onUpdateTracking}
        onPreviousSlideClicked={this.onPreviousSlideClicked}
        onNextSlideClicked={this.onNextSlideClicked}
      />
    );
  }
};

export default WithCache(SlidePlayerContainer, null, ['tracking']);