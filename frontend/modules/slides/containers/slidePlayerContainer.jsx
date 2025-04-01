import React, { Component } from 'react';
import SlidePlayer from '../components/slidePlayer';
import updateRun from '~/modules/run/helpers/updateRun';
import navigateTo from '~/modules/run/helpers/navigateTo';
import trigger from '~/modules/triggers/helpers/trigger';
import getSlideStage from '~/modules/run/helpers/getSlideStage';
import WithCache from '~/core/cache/containers/withCache';
import navigateBack from '~/modules/run/helpers/navigateBack';
import navigateToNextSlide from '~/modules/run/helpers/navigateToNextSlide';
import getSlideNavigationDetails from '~/modules/run/helpers/getSlideNavigationDetails';
import setSlideToComplete from '~/modules/run/helpers/setSlideToComplete';
import setScenarioConsent from '~/modules/run/helpers/setScenarioConsent';
import getNextSlide from '~/modules/run/helpers/getNextSlide';
import setScenarioToComplete from '~/modules/run/helpers/setScenarioToComplete';
import WithRouter from '~/core/app/components/withRouter';
import addModal from '~/core/dialogs/helpers/addModal';

class SlidePlayerContainer extends Component {

  state = {
    isLoading: true,
    isMenuOpen: false
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
        if (this.props.run.data.isComplete) {
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

  onUpdateBlockTracking = async ({ blockRef, update }) => {
    await updateRun({ slideRef: this.props.activeSlide.ref, blockRef, update });
  }

  onPreviousSlideClicked = () => {
    return navigateBack();
  }

  onNextSlideClicked = () => {
    setSlideToComplete({ slideRef: this.props.activeSlide.ref });
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
      case 'BACK':
        this.onPreviousSlideClicked();
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
      case 'RERUN_SCENARIO':
        this.props.router.navigate(0);
        break;
    }
  }

  onMenuClicked = (isMenuOpen) => {
    this.setState({ isMenuOpen });
  }

  onMenuActionClicked = (action) => {
    if (action === 'END_SCENARIO_RUN') {
      addModal({
        title: 'End this scenario?',
        body: 'Are you sure you want to end this scenario run?',
        actions: [{
          type: 'NO',
          text: 'No'
        }, {
          type: 'YES',
          text: 'Yes',
          color: 'primary'
        }]
      }, (state, { type, modal }) => {
        if (state === 'ACTION') {
          if (type === 'YES') {
            this.onActionClicked('FINISH_SCENARIO');
            setTimeout(() => {
              this.props.router.navigate(`/scenarios`);
            }, 1000);
          }
        }
      })
    }
  }

  render() {

    const { scenario, activeSlide, activeBlocks } = this.props;

    const { isMenuOpen } = this.state;

    const slideStage = getSlideStage();

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
        isMenuOpen={isMenuOpen}
        navigateTo={this.navigateTo}
        slideStage={slideStage}
        primaryAction={primaryAction}
        secondaryAction={secondaryAction}
        onActionClicked={this.onActionClicked}
        onUpdateBlockTracking={this.onUpdateBlockTracking}
        onMenuClicked={this.onMenuClicked}
        onMenuActionClicked={this.onMenuActionClicked}
      />
    );
  }
};

export default WithRouter(WithCache(SlidePlayerContainer, null, ['run']));