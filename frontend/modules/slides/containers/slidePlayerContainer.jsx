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
import filter from 'lodash/filter';
import getCache from '~/core/cache/helpers/getCache';
import getTrigger from '~/modules/triggers/helpers/getTrigger';
import setShouldStopNavigation from '~/modules/run/helpers/setShouldStopNavigation';
import setSlideToSubmitted from '~/modules/run/helpers/setSlideToSubmitted';
import setScenarioToArchived from '~/modules/run/helpers/setScenarioToArchived';

class SlidePlayerContainer extends Component {

  state = {
    isLoading: true,
    isMenuOpen: false,
    isSubmitting: false,
    shouldStopNavigation: false
  }

  componentDidMount = () => {
    this.setState({ isLoading: false });
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.activeSlide !== prevProps.activeSlide) {
      this.setState({ isLoading: false });
    }
  }

  getNavigationDetails = () => {

    let primaryAction;
    let secondaryAction;

    const { activeSlide } = this.props;

    const { isSubmitting } = this.state;

    const { isAbleToCompleteSlide, hasRequiredPrompts, hasPrompts, isSubmitted } = getSlideNavigationDetails();

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

      if (nextSlide || (!nextSlide && this.props.isPreview)) {
        primaryAction = {
          action: 'NEXT',
          color: 'primary',
          text: 'Next',
          isActive: hasRequiredPrompts && !isAbleToCompleteSlide
        }
        secondaryAction = {
          action: 'BACK',
          text: 'Back',
          isActive: true,
          isDisabled: isSubmitting
        }
        if (hasPrompts && !isSubmitted) {
          primaryAction = {
            action: 'SUBMIT',
            color: 'primary',
            text: isSubmitting ? 'Submitting' : 'Submit',
            isDisabled: (hasRequiredPrompts && !isAbleToCompleteSlide) || isSubmitting
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
        } else if (hasPrompts && !isSubmitted) {
          secondaryAction = {
            action: 'BACK',
            text: 'Back',
            isActive: true,
            isDisabled: isSubmitting
          }
          primaryAction = {
            action: 'SUBMIT',
            color: 'primary',
            text: isSubmitting ? 'Submitting' : 'Submit',
            isDisabled: (hasRequiredPrompts && !isAbleToCompleteSlide) || isSubmitting
          }
        } else {
          primaryAction = {
            action: 'COMPLETE_SCENARIO',
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
    return navigateToNextSlide({ router: this.props.router });
  }

  onSubmitSlideClicked = async () => {
    this.setState({ isSubmitting: true });
    setSlideToComplete({ slideRef: this.props.activeSlide.ref });
    const triggers = filter(getCache('triggers').data, (trigger) => trigger.elementRef === this.props.activeSlide.ref);
    for (const trigger of triggers) {
      const triggerItem = getTrigger(trigger.action);
      const shouldStopNavigation = triggerItem.getShouldStopNavigation();
      if (shouldStopNavigation) {
        setShouldStopNavigation(true);
      }
      console.log(`Triggering: ${triggerItem.getText()}`);
      await triggerItem.trigger(trigger);
      console.log(`Triggered: ${triggerItem.getText()}`);
    }

    setSlideToSubmitted();
    const stage = getSlideStage();
    this.setState({ isSubmitting: false });

    if (!stage.shouldStopNavigation) {
      return navigateToNextSlide({ router: this.props.router });
    }
  }

  onConsentAcceptedClicked = () => {
    setScenarioConsent(true);
  }

  onConsentDeniedClicked = () => {
    setScenarioConsent(false);
  }

  onFinishScenarioClicked = () => {
    setScenarioToArchived();
  }

  onCompleteScenarioClicked = () => {
    setSlideToComplete({ slideRef: this.props.activeSlide.ref });
    setScenarioToComplete();
  }

  navigateTo = ({ slideRef }) => {
    return navigateTo({ slideRef, router: this.props.router });
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
      case 'COMPLETE_SCENARIO':
        this.onCompleteScenarioClicked();
        break;
      case 'SUBMIT':
        this.onSubmitSlideClicked();
        break;
      case 'RETURN_TO_SCENARIOS':
        this.props.router.navigate(`/scenarios`);
        break;
      case 'RERUN_SCENARIO':
        setScenarioToArchived().then(() => {
          window.location.reload();
        });
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
        run={this.props.run.data}
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