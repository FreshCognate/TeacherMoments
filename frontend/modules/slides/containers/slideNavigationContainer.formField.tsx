import React, { Component } from 'react';
import registerField from '~/core/forms/helpers/registerField';
import SlideNavigationFormField from '../components/slideNavigation.formField';

interface SlideNavigationContainerFormFieldProps {
  value: string,
  schema: any,
  updateField: (value: string) => void
}

interface SlideNavigationContainerFormFieldState {
  isEditing: boolean
}

class SlideNavigationContainerFormField extends Component<SlideNavigationContainerFormFieldProps, SlideNavigationContainerFormFieldState> {

  state = {
    isEditing: false,
  }

  onEditClicked = () => {
    this.setState({ isEditing: true });
  }

  onNavigationOptionClicked = (value: string) => {
    this.setState({ isEditing: false });
    this.props.updateField(value);
  }

  render() {
    const { value, schema, updateField } = this.props;
    return (
      <SlideNavigationFormField
        value={value}
        schema={schema}
        isEditing={this.state.isEditing}
        onEditClicked={this.onEditClicked}
        onNavigationOptionClicked={this.onNavigationOptionClicked}
      />
    );
  }
};

export default registerField('SlideNavigation', SlideNavigationContainerFormField);