import React, { Component } from 'react';
import SlidePlayer from '../components/slidePlayer';
import updateTracking from '~/modules/tracking/helpers/updateTracking';
import navigateTo from '~/modules/tracking/helpers/navigateTo';
import trigger from '~/modules/triggers/helpers/trigger';
import getSlideTracking from '~/modules/tracking/helpers/getSlideTracking';
import WithCache from '~/core/cache/containers/withCache';
import navigateBack from '~/modules/tracking/helpers/navigateBack';
import getSlideNavigationDetails from '~/modules/tracking/helpers/getSlideNavigationDetails';
import setSlideToComplete from '~/modules/tracking/helpers/setSlideToComplete';

class SlidePlayerContainer extends Component {

  state = {
    isLoading: true
  }

  componentDidMount = () => {
    this.setState({ isLoading: false });
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
    let hasNextButton = false;
    let hasSubmitButton = false;
    let isNextButtonActive = false;
    let isSubmitButtonActive = false;
    const { activeSlide } = this.props;
    if (activeSlide?.isRoot || !activeSlide?.hasNavigateBack) {
      hasBackButton = false;
    }

    const { isAbleToCompleteSlide, hasRequiredPrompts } = getSlideNavigationDetails();

    if (isAbleToCompleteSlide) {
      isSubmitButtonActive = true;
    }

    if (!hasRequiredPrompts) {
      hasNextButton = true;
      isNextButtonActive = true;
    } else {
      hasSubmitButton = true;
    }

    return {
      hasBackButton,
      hasNextButton,
      hasSubmitButton,
      isNextButtonActive,
      isSubmitButtonActive
    }
  }

  onUpdateTracking = async ({ blockRef, update }) => {
    await updateTracking({ slideRef: this.props.activeSlide.ref, blockRef, update });
  }

  onPreviousSlideClicked = () => {
    return navigateBack();
  }

  onNextSlideClicked = () => {
    setSlideToComplete({ slideRef: this.props.activeSlide.ref });
    return navigateTo({ slideRef: this.props.activeSlide.children[0] });
  }

  onSubmitSlideClicked = () => {
    setSlideToComplete({ slideRef: this.props.activeSlide.ref });
    return navigateTo({ slideRef: this.props.activeSlide.children[0] });
  }

  navigateTo = ({ slideRef }) => {
    return navigateTo({ slideRef });
  }

  render() {

    const { scenario, activeSlide, activeBlocks } = this.props;

    const slideTracking = getSlideTracking();

    const { hasBackButton, hasNextButton, hasSubmitButton, isNextButtonActive, isSubmitButtonActive } = this.getNavigationDetails();

    return (
      <SlidePlayer
        scenario={scenario}
        activeSlide={activeSlide}
        activeBlocks={activeBlocks}
        isLoading={this.state.isLoading}
        navigateTo={this.navigateTo}
        tracking={slideTracking}
        hasBackButton={hasBackButton}
        hasNextButton={hasNextButton}
        hasSubmitButton={hasSubmitButton}
        isNextButtonActive={isNextButtonActive}
        isSubmitButtonActive={isSubmitButtonActive}
        onUpdateTracking={this.onUpdateTracking}
        onPreviousSlideClicked={this.onPreviousSlideClicked}
        onNextSlideClicked={this.onNextSlideClicked}
        onSubmitSlideClicked={this.onSubmitSlideClicked}
      />
    );
  }
};

export default WithCache(SlidePlayerContainer, null, ['tracking']);