import React, { Component } from 'react';
import TriggerPromptAction from '../components/triggerPromptAction';
import createTrigger from '../helpers/createTrigger';
import WithCache from '~/core/cache/containers/withCache';
import type { Scenario } from '~/modules/scenarios/scenarios.types';
import handleRequestError from '~/core/app/helpers/handleRequestError';
import axios from 'axios';
import getCache from '~/core/cache/helpers/getCache';
import getStemsBySlideRef from '~/modules/stems/helpers/getStemsBySlideRef';

interface TriggerPromptActionContainerProps {
  slideRef: string;
  scenario: {
    data: Scenario;
  };
  onOpenTriggersClicked: () => void;
}

class TriggerPromptActionContainer extends Component<TriggerPromptActionContainerProps> {

  onAddFeedbackClicked = () => {
    createTrigger({ scenario: this.props.scenario.data._id, elementRef: this.props.slideRef, action: "SHOW_FEEDBACK_FROM_PROMPTS" });
    this.props.onOpenTriggersClicked();
  }

  onAddStemClicked = () => {
    createTrigger({ scenario: this.props.scenario.data._id, elementRef: this.props.slideRef, action: "BRANCH_TO_STEM_FROM_PROMPTS" });
    const stems = getStemsBySlideRef({ slideRef: this.props.slideRef });
    if (stems.length < 2) {
      axios.post('/api/stems', {
        scenarioId: this.props.scenario.data._id,
        slideRef: this.props.slideRef
      }).then(() => {
        const stems = getCache('stems');
        if (stems && stems.fetch) {
          stems.fetch()
        }
        const slides = getCache('slides');
        if (slides && slides.fetch) {
          slides.fetch()
        }
      }).catch(handleRequestError);
    }
    this.props.onOpenTriggersClicked();
  }

  render() {
    const stems = getStemsBySlideRef({ slideRef: this.props.slideRef });
    return (
      <TriggerPromptAction
        stemsCount={stems.length}
        onAddFeedbackClicked={this.onAddFeedbackClicked}
        onAddStemClicked={this.onAddStemClicked}
      />
    );
  }
};

export default WithCache(TriggerPromptActionContainer, {}, ['scenario']);