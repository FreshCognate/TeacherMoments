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
import getNextSlide from '~/modules/tracking/helpers/getNextSlide';
import setScenarioToComplete from '~/modules/tracking/helpers/setScenarioToComplete';
import WithRouter from '~/core/app/components/withRouter';

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

    let primaryAction;
    let secondaryAction;

    const { activeSlide } = this.props;

    const { isAbleToCompleteSlide, hasRequiredPrompts } = getSlideNavigationDetails();

    if (activeSlide?.slideType === 'CONSENT') {
      secondaryAction = {
        action: 'CONSENT_DENIED',
        color: 'warning',
        text: 'No, I do not consent',
        isActive: true
      }
      primaryAction = {
        action: 'CONSENT_ACCEPTED',
        color: 'primary',
        text: 'Yes, I consent',
        isActive: true
      }
    } else {
      const nextSlide = getNextSlide();

      if (nextSlide) {
        primaryAction = {
          action: 'NEXT',
          color: 'primary',
          text: 'Next',
          isActive: hasRequiredPrompts && !isAbleToCompleteSlide
        }
        secondaryAction = {
          action: 'BACK',
          text: 'Back',
          isActive: true
        }
        if (hasRequiredPrompts) {
          primaryAction = {
            action: 'SUBMIT',
            color: 'primary',
            text: 'Submit',
            isDisabled: hasRequiredPrompts && !isAbleToCompleteSlide
          }
        }
      } else {
        if (this.props.tracking.data.isComplete) {
          secondaryAction = {
            action: 'RERUN_SCENARIO',
            text: 'Rerun this scenario'
          }
          primaryAction = {
            action: 'RETURN_TO_SCENARIOS',
            color: 'primary',
            text: 'Return to scenarios'
          }
        } else {
          primaryAction = {
            action: 'FINISH_SCENARIO',
            color: 'primary',
            text: 'Finish',
          }
        }
      }
    }

    return {
      primaryAction,
      secondaryAction
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
    return navigateToNextSlide();
  }

  onConsentAcceptedClicked = () => {
    setScenarioConsent(true);
  }

  onConsentDeniedClicked = () => {
    setScenarioConsent(false);
  }

  onFinishScenarioClicked = () => {
    setSlideToComplete({ slideRef: this.props.activeSlide.ref });
    setScenarioToComplete();
  }

  navigateTo = ({ slideRef }) => {
    return navigateTo({ slideRef });
  }

  onActionClicked = (action) => {
    switch (action) {
      case 'CONSENT_DENIED':
        this.onConsentDeniedClicked();
        break;
      case 'CONSENT_ACCEPTED':
        this.onConsentAcceptedClicked();
        break;
      case 'NEXT':
        this.onNextSlideClicked();
        break;
      case 'FINISH_SCENARIO':
        this.onFinishScenarioClicked();
        break;
      case 'SUBMIT':
        this.onSubmitSlideClicked();
        break;
      case 'RETURN_TO_SCENARIOS':
        this.props.router.navigate(`/scenarios`);
        break;
    }
  }

  render() {

    const { scenario, activeSlide, activeBlocks } = this.props;

    const slideTracking = getSlideTracking();

    const {
      primaryAction,
      secondaryAction,
    } = this.getNavigationDetails();

    return (
      <SlidePlayer
        scenario={scenario}
        activeSlide={activeSlide}
        activeBlocks={activeBlocks}
        isLoading={this.state.isLoading}
        navigateTo={this.navigateTo}
        tracking={slideTracking}
        primaryAction={primaryAction}
        secondaryAction={secondaryAction}
        onActionClicked={this.onActionClicked}
        onUpdateTracking={this.onUpdateTracking}
      />
    );
  }
};

export default WithRouter(WithCache(SlidePlayerContainer, null, ['tracking']));