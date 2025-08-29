import React, { Component } from 'react';
import EditPromptCondition from '../components/editPromptCondition';
import find from 'lodash/find';
import cloneDeep from 'lodash/cloneDeep';
import includes from 'lodash/includes';
import WithCache from '~/core/cache/containers/withCache';

class EditPromptConditionContainer extends Component {

  onAnswerClicked = (selectedOptionId) => {
    const { isMultiSelect, options } = this.props.prompt;
    const currentOption = find(options, { _id: selectedOptionId });

    let usersSelectedOption = currentOption.value;

    let clonedSelectedOptions = cloneDeep(this.props.modal.data.selectedOptions);

    if (isMultiSelect) {
      if (includes(clonedSelectedOptions, usersSelectedOption)) {
        remove(clonedSelectedOptions, (item) => {
          if (item === usersSelectedOption) return true;
        });
      } else {
        clonedSelectedOptions.push(usersSelectedOption);
      }
    } else {
      clonedSelectedOptions = [usersSelectedOption];
    }

    this.props.modal.set({ selectedOptions: clonedSelectedOptions });

  }

  render() {
    const { prompt } = this.props;

    return (
      <EditPromptCondition prompt={prompt} blockTracking={this.props.modal.data} onAnswerClicked={this.onAnswerClicked} />
    );
  }
};

export default WithCache(EditPromptConditionContainer, null, ['modal']);