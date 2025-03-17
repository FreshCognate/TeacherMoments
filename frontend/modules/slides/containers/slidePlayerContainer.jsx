import React, { Component } from 'react';
import SlidePlayer from '../components/slidePlayer';
import updateTracking from '~/modules/tracking/helpers/updateTracking';
import navigateTo from '~/modules/tracking/helpers/navigateTo';
import trigger from '~/modules/triggers/helpers/trigger';
import getSlideTracking from '~/modules/tracking/helpers/getSlideTracking';
import WithCache from '~/core/cache/containers/withCache';
import navigateBack from '~/modules/tracking/helpers/navigateBack';
import navigateToNextSlide from '~/modules/tracking/helpers/navigateToNextSlide';
import getSlideNavigationDetails from '~/modules/tracking/helpers/getSlideNavigationDetails';
import setSlideToComplete from '~/modules/tracking/helpers/setSlideToComplete';
import setScenarioConsent from '~/modules/tracking/helpers/setScenarioConsent';

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
    let hasBackButton = false;
    let hasNextButton = false;
    let hasSubmitButton = false;
    let hasConsentButtons = false;
    let isNextButtonActive = false;
    let isSubmitButtonActive = false;
    let hasBranching = false;
    const { activeSlide } = this.props;

    const { isAbleToCompleteSlide, hasRequiredPrompts } = getSlideNavigationDetails();

    if (activeSlide?.slideType === 'CONSENT') {
      hasConsentButtons = true;
    }

    switch (activeSlide?.navigation) {
      case 'BIDIRECTIONAL':
        hasNextButton = true;
        hasBackButton = true;
        isNextButtonActive = !hasRequiredPrompts || isAbleToCompleteSlide;
        break;
      case 'BACKWARD':
        hasBackButton = true;
        break;
      case 'FORWARD':
        hasNextButton = true;
        isNextButtonActive = !hasRequiredPrompts || isAbleToCompleteSlide;
        break;
      case 'SUBMIT':
        hasSubmitButton = true;
        isSubmitButtonActive = !hasRequiredPrompts || isAbleToCompleteSlide;;
        break;
    }

    return {
      hasBackButton,
      hasNextButton,
      hasSubmitButton,
      hasConsentButtons,
      isNextButtonActive,
      isSubmitButtonActive,
      hasBranching
    }
  }

  onUpdateTracking = async ({ blockRef, update }) => {
    await updateTracking({ slideRef: this.props.activeSlide.ref, blockRef, update });
  }

  onPreviousSlideClicked = () => {
    return navigateBack();
  }

  onNextSlideClicked = () => {
    return navigateToNextSlide();
  }

  onSubmitSlideClicked = () => {
    setSlideToComplete({ slideRef: this.props.activeSlide.ref });
    return navigateTo({ slideRef: this.props.activeSlide.children[0] });
  }

  onConsentAcceptedClicked = () => {
    setScenarioConsent(true);
  }

  onConsentDeniedClicked = () => {
    setScenarioConsent(false);
  }

  navigateTo = ({ slideRef }) => {
    return navigateTo({ slideRef });
  }

  render() {

    const { scenario, activeSlide, activeBlocks } = this.props;

    const slideTracking = getSlideTracking();

    const { hasBackButton, hasNextButton, hasSubmitButton, hasConsentButtons, isNextButtonActive, isSubmitButtonActive } = this.getNavigationDetails();

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
        hasConsentButtons={hasConsentButtons}
        isNextButtonActive={isNextButtonActive}
        isSubmitButtonActive={isSubmitButtonActive}
        onUpdateTracking={this.onUpdateTracking}
        onPreviousSlideClicked={this.onPreviousSlideClicked}
        onNextSlideClicked={this.onNextSlideClicked}
        onSubmitSlideClicked={this.onSubmitSlideClicked}
        onConsentAcceptedClicked={this.onConsentAcceptedClicked}
        onConsentDeniedClicked={this.onConsentDeniedClicked}
      />
    );
  }
};

export default WithCache(SlidePlayerContainer, null, ['tracking']);