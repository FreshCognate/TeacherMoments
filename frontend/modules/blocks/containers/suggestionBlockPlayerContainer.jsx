import React, { Component } from 'react';
import SuggestionBlockPlayer from '../components/suggestionBlockPlayer';

class SuggestionBlockPlayerContainer extends Component {

  state = {
    isOpen: false
  }

  onSuggestionButtonClicked = () => {
    this.setState({ isOpen: true });
  }

  render() {
    return (
      <SuggestionBlockPlayer
        isOpen={this.state.isOpen}
        block={this.props.block}
        onSuggestionButtonClicked={this.onSuggestionButtonClicked}
      />
    );
  }
};

export default SuggestionBlockPlayerContainer;