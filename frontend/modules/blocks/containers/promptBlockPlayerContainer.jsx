import React, { Component } from 'react';
import PromptBlockPlayer from '../components/promptBlockPlayer';

class PromptBlockPlayerContainer extends Component {
  render() {
    const { block } = this.props;
    return (
      <PromptBlockPlayer block={block} />
    );
  }
};

export default PromptBlockPlayerContainer;