import React, { Component } from 'react';
import TextArea from '../components/textArea.formField';
import registerField from '~/core/forms/helpers/registerField';

class TextAreaContainer extends Component {

  componentDidUpdate = (prevProps) => {
    if (this.props.value !== this.editor.children && prevProps.renderKey !== this.props.renderKey) {
      this.editor.children = this.props.value;
    }
  };

  onLoad = ({ editor }) => {
    this.editor = editor;
  };

  render() {
    const { value, schema, updateField } = this.props;
    return (
      <TextArea
        value={value}
        schema={schema}
        updateField={updateField}
        onLoad={this.onLoad}
      />
    );
  }
};

export default registerField('TextArea', TextAreaContainer);