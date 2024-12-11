import React, { Component } from 'react';
import ActionsBlockPlayer from '../components/actionsBlockPlayer';

class ActionsBlockPlayerContainer extends Component {
  render() {
    return (
      <ActionsBlockPlayer block={this.props.block} />
    );
  }
};

export default ActionsBlockPlayerContainer;