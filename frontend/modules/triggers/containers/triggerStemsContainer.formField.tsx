import registerField from '~/core/forms/helpers/registerField';
import TriggerStems from '../components/triggerStems.formField';
import WithCache from '~/core/cache/containers/withCache';

import React, { Component } from 'react';
import getStemsBySlideRef from '~/modules/stems/helpers/getStemsBySlideRef';
import getPromptBlocksBySlideRef from '~/modules/blocks/helpers/getPromptBlocksBySlideRef';
import find from 'lodash/find';
import cloneDeep from 'lodash/cloneDeep';
import remove from 'lodash/remove';
import addModal from '~/core/dialogs/helpers/addModal';
import EditPromptConditionContainer from './editPromptConditionContainer';

class TriggerStemsContainer extends Component {

  getPrompts = () => {

    const prompts = getPromptBlocksBySlideRef({ slideRef: this.props.model.elementRef });

    return prompts;
  }

  onAddConditionClicked = ({ elementRef }: { elementRef: string }) => {
    const clonedValue = cloneDeep(this.props.value);
    const currentItem = find(clonedValue, { elementRef });
    console.log(currentItem);
    if (currentItem) {
      currentItem.conditions.push({});
      this.props.updateField(clonedValue);
    } else {
      clonedValue.push({ elementRef: elementRef, conditions: [{}] });
      this.props.updateField(clonedValue);
    }
  }

  onEditPromptConditionClicked = ({ elementRef, prompt, condition }) => {

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
            elementRef,
            key: 'options',
            value: modal.selectedOptions,
            blockRef: prompt.ref,
            conditionId: condition._id
          });
        }
        if (prompt.blockType === 'INPUT_PROMPT') {
          this.onPromptConditionValueChanged({
            elementRef,
            key: 'text',
            value: modal.textValue,
            blockRef: prompt.ref,
            conditionId: condition._id
          });
        }
      }
    })
  }

  onPromptConditionValueChanged = ({ elementRef, key, value, blockRef, conditionId }) => {
    const clonedValue = cloneDeep(this.props.value);
    const currentItem = find(clonedValue, { elementRef });
    const condition = find(currentItem.conditions, { _id: conditionId });
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

  onRemoveConditionClicked = ({ elementRef, conditionId }) => {
    const clonedValue = cloneDeep(this.props.value);
    const currentItem = find(clonedValue, { elementRef });
    remove(currentItem.conditions, { _id: conditionId });
    this.props.updateField(clonedValue);
  }

  render() {

    const slideStems = getStemsBySlideRef({ slideRef: this.props.model.elementRef })

    console.log(this.props.value);

    return (
      <TriggerStems
        slideStems={slideStems}
        items={this.props.value}
        prompts={this.getPrompts()}
        onAddConditionClicked={this.onAddConditionClicked}
        onEditPromptConditionClicked={this.onEditPromptConditionClicked}
        onRemoveConditionClicked={this.onRemoveConditionClicked}
      />
    );
  }
};

export default registerField('TriggerStems', WithCache(TriggerStemsContainer, {}, ['slides', 'blocks', 'stems']));