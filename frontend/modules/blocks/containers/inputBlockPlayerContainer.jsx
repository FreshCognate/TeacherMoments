import React, { Component } from 'react';
import InputBlockPlayer from '../components/inputBlockPlayer';

class InputBlockPlayerContainer extends Component {
  render() {
    const { block } = this.props;
    return (
      <InputBlockPlayer block={block} />
    );
  }
};

export default InputBlockPlayerContainer;