import React, { Component } from 'react';
import FeedbackItemConditions from '../components/feedbackItemConditions.formField';
import registerField from '~/core/forms/helpers/registerField';
import cloneDeep from 'lodash/cloneDeep';
import getPromptBlocksBySlideRef from '~/modules/blocks/helpers/getPromptBlocksBySlideRef';
import getCache from '~/core/cache/helpers/getCache';
import find from 'lodash/find';

class FeedbackItemConditionsContainer extends Component {

  getPrompts = () => {
    const slide = getCache('slide');

    const prompts = getPromptBlocksBySlideRef({ slideRef: slide.data.ref });

    return prompts;
  }

  onAddConditionClicked = () => {
    const clonedValue = cloneDeep(this.props.value);
    clonedValue.push({ blocksByRef: {} });
    this.props.updateField(clonedValue);
  }

  onRemoveConditionClicked = (index) => {
    const clonedValue = cloneDeep(this.props.value);
    clonedValue.splice(index, 1);
    this.props.updateField(clonedValue);
  }

  onPromptConditionValueChanged = ({ value, blockRef, conditionId }) => {
    const clonedValue = cloneDeep(this.props.value);
    const condition = find(clonedValue, { _id: conditionId });
    condition.blocksByRef = condition.blocksByRef || {};
    condition.blocksByRef[blockRef] = [value];
    this.props.updateField(clonedValue);
  }

  render() {
    return (
      <FeedbackItemConditions
        value={this.props.value}
        prompts={this.getPrompts()}
        onAddConditionClicked={this.onAddConditionClicked}
        onRemoveConditionClicked={this.onRemoveConditionClicked}
        onPromptConditionValueChanged={this.onPromptConditionValueChanged}
      />
    );
  }
};

export default registerField('FeedbackItemConditions', FeedbackItemConditionsContainer);