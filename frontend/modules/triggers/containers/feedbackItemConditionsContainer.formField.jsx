import React, { Component } from 'react';
import FeedbackItemConditions from '../components/feedbackItemConditions.formField';
import registerField from '~/core/forms/helpers/registerField';
import cloneDeep from 'lodash/cloneDeep';
import getPromptBlocksBySlideRef from '~/modules/blocks/helpers/getPromptBlocksBySlideRef';
import getCache from '~/core/cache/helpers/getCache';
import find from 'lodash/find';
import remove from 'lodash/remove';
import addModal from '~/core/dialogs/helpers/addModal';
import EditPromptConditionContainer from './editPromptConditionContainer';

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

  onRemoveConditionClicked = (conditionId) => {
    const clonedValue = cloneDeep(this.props.value);
    remove(clonedValue, { _id: conditionId });
    this.props.updateField(clonedValue);
  }

  onPromptConditionValueChanged = ({ key, value, blockRef, conditionId }) => {
    const clonedValue = cloneDeep(this.props.value);
    const condition = find(clonedValue, { _id: conditionId });
    const prompt = find(condition.prompts, { ref: blockRef });

    if (!prompt) {
      let prompt = {
        ref: blockRef
      };
      prompt[key] = value;
      condition.prompts.push(prompt);
    } else {
      prompt[key] = value;
    }

    this.props.updateField(clonedValue);
  }

  onEditPromptConditionClicked = ({ prompt, condition }) => {

    const conditionPrompt = find(condition.prompts, { ref: prompt.ref }) || {};

    const selectedOptions = conditionPrompt.options || [];
    const textValue = conditionPrompt.text || '';

    addModal({
      title: 'Edit prompt condition',
      component: <EditPromptConditionContainer prompt={prompt} condition={condition} />,
      model: { selectedOptions, textValue },
      actions: [{
        type: 'CANCEL',
        text: 'Cancel'
      }, {
        type: 'SAVE',
        text: 'Save',
        color: 'primary'
      }]
    }, (state, { type, modal }) => {
      if (state === 'ACTION' && type === 'SAVE') {
        if (prompt.blockType === 'MULTIPLE_CHOICE_PROMPT') {
          this.onPromptConditionValueChanged({
            key: 'options',
            value: modal.selectedOptions,
            blockRef: prompt.ref,
            conditionId: condition._id
          });
        }
        if (prompt.blockType === 'INPUT_PROMPT') {
          this.onPromptConditionValueChanged({
            key: 'text',
            value: modal.textValue,
            blockRef: prompt.ref,
            conditionId: condition._id
          });
        }
      }
    })
  }

  render() {
    return (
      <FeedbackItemConditions
        value={this.props.value}
        prompts={this.getPrompts()}
        onAddConditionClicked={this.onAddConditionClicked}
        onRemoveConditionClicked={this.onRemoveConditionClicked}
        onEditPromptConditionClicked={this.onEditPromptConditionClicked}
      />
    );
  }
};

export default registerField('FeedbackItemConditions', FeedbackItemConditionsContainer);