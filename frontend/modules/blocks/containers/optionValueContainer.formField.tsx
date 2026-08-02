import React, { Component } from 'react';
import registerField from '~/core/forms/helpers/registerField';
import OptionValue from '../components/optionValue';
import getString from '~/modules/ls/helpers/getString';

type OptionValueContainerFormFieldProps = {
  model: any,
  value?: string,
  updateField: (value: string) => void
};

class OptionValueContainerFormField extends Component<OptionValueContainerFormFieldProps> {

  getValue = (): string => {
    if (this.props.value) return this.props.value;
    return getString({ model: this.props.model, field: 'text' }) || '';
  }

  render() {
    const value = this.getValue();
    return (
      <OptionValue
        value={value}
        isDisabled={true}
        updateField={this.props.updateField}
      />
    );
  }
};

export default registerField('OptionValue', OptionValueContainerFormField);