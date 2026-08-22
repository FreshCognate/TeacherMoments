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
import { ConditionPrompt, Condition, StemItem } from '../triggers.types';

type TriggerStemsContainerProps = {
  model: { elementRef: string },
  value: StemItem[],
  updateField: (value: StemItem[]) => void
};

class TriggerStemsContainer extends Component<TriggerStemsContainerProps> {

  getPrompts = () => {

    const prompts = getPromptBlocksBySlideRef({ slideRef: this.props.model.elementRef });

    return prompts;
  }

  onAddConditionClicked = ({ elementRef }: { elementRef: string }) => {
    const clonedValue = cloneDeep(this.props.value);
    const currentItem = find(clonedValue, { elementRef });
    if (currentItem) {
      currentItem.conditions.push({});
      this.props.updateField(clonedValue);
    } else {
      clonedValue.push({ elementRef: elementRef, conditions: [{}] });
      this.props.updateField(clonedValue);
    }
  }

  onEditPromptConditionClicked = ({ elementRef, prompt, condition }: { elementRef: string, prompt: any, condition: Condition }) => {

    const conditionPrompt: ConditionPrompt | {} = find(condition.prompts, { ref: prompt.ref }) || {};

    const selectedOptions = (conditionPrompt as ConditionPrompt).options || [];
    const textValue = (conditionPrompt as ConditionPrompt).text || '';

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
    }, (state: string, { type, modal }: { type: string, modal: any }) => {
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

  onPromptConditionValueChanged = ({ elementRef, key, value, blockRef, conditionId }: { elementRef: string, key: 'options' | 'text', value: any, blockRef: string, conditionId?: string }) => {
    const clonedValue = cloneDeep(this.props.value);
    const currentItem = find(clonedValue, { elementRef });
    const condition = currentItem && find(currentItem.conditions, { _id: conditionId });

    if (!condition) return;

    condition.prompts = condition.prompts || [];
    const prompt = find(condition.prompts, { ref: blockRef });

    if (!prompt) {
      const newPrompt: ConditionPrompt = {
        ref: blockRef
      };
      newPrompt[key] = value;
      condition.prompts.push(newPrompt);
    } else {
      prompt[key] = value;
    }

    this.props.updateField(clonedValue);
  }

  onRemoveConditionClicked = ({ elementRef, conditionId }: { elementRef: string, conditionId?: string }) => {
    const clonedValue = cloneDeep(this.props.value);
    const currentItem = find(clonedValue, { elementRef });
    if (!currentItem) return;
    remove(currentItem.conditions, { _id: conditionId });
    this.props.updateField(clonedValue);
  }

  render() {

    const slideStems = getStemsBySlideRef({ slideRef: this.props.model.elementRef })

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