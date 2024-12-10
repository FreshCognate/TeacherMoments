import React, { Component } from 'react';
import TextBlockPlayer from '../components/textBlockPlayer';

class TextBlockPlayerContainer extends Component {
  render() {
    const { block } = this.props;
    return (
      <TextBlockPlayer block={block} />
    );
  }
};

export default TextBlockPlayerContainer;