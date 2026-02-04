import React, { Component } from 'react';
import each from 'lodash/each';
import filter from 'lodash/filter';
import ValidationIndicator from '~/uikit/badges/components/validationIndicator';
import WithCache from '~/core/cache/containers/withCache';
import getTriggerErrors from '~/modules/triggers/helpers/getTriggerErrors';

class TriggersValidationContainer extends Component {

  getTriggerErrors = () => {
    const { data } = this.props.triggers;
    const triggers = filter(data, (trigger) => trigger.elementRef === this.props.slide.data?.ref);
    const errors = [];

    each(triggers, (trigger) => {
      const triggerErrors = getTriggerErrors(trigger);
      each(triggerErrors, (error) => errors.push(error));
    });

    return errors;
  }

  render() {
    return (
      <ValidationIndicator errors={this.getTriggerErrors()} />
    );
  }
};

export default WithCache(TriggersValidationContainer, null, ['triggers', 'slide']);