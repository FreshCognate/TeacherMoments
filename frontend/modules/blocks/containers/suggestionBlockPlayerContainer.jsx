import React, { Component } from 'react';
import SuggestionBlockPlayer from '../components/suggestionBlockPlayer';

class SuggestionBlockPlayerContainer extends Component {

  render() {
    return (
      <SuggestionBlockPlayer
        block={this.props.block}
      />
    );
  }
};

export default SuggestionBlockPlayerContainer;