import React, { Component } from 'react';
import axios from 'axios';
import Username from '../components/username.formField';
import registerField from '~/core/forms/helpers/registerField';

class UsernameContainer extends Component<any> {

  state = {
    isGenerating: false,
    error: '',
  };

  componentDidMount() {
    this.onGenerateUsername();
  }

  onGenerateUsername = () => {
    this.setState({ isGenerating: true, error: '' });
    axios.get('/api/signup/username').then((response) => {
      const { username } = response.data;
      this.props.updateField(username);
      this.setState({ isGenerating: false });
    }).catch((error) => {
      const message = error.response?.data?.message || 'Unable to generate username. Please try again later.';
      this.setState({ isGenerating: false, error: message });
    });
  };

  render() {
    const { value, schema, updateField } = this.props;
    const { isGenerating, error } = this.state;

    return (
      <Username
        value={value}
        schema={schema}
        isGenerating={isGenerating}
        error={error}
        updateField={updateField}
        onGenerateUsername={this.onGenerateUsername}
      />
    );
  }
}

registerField('Username', UsernameContainer);
