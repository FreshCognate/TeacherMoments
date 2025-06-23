import React, { Component } from 'react';
import FeedbackItemConditions from '../components/feedbackItemConditions.formField';
import registerField from '~/core/forms/helpers/registerField';

class FeedbackItemConditionsContainer extends Component {
  render() {
    return (
      <FeedbackItemConditions />
    );
  }
};

export default registerField('FeedbackItemConditions', FeedbackItemConditionsContainer);