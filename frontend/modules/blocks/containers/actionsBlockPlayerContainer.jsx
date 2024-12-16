import React, { Component } from 'react';
import ActionsBlockPlayer from '../components/actionsBlockPlayer';

class ActionsBlockPlayerContainer extends Component {

  onActionClicked = (slideRef) => {
    console.log(slideRef);
    if (slideRef) {
      this.props.navigateTo({ slideRef });
    } else {
      console.warn('This action is missing a slide');
    }
  }

  render() {
    return (
      <ActionsBlockPlayer
        block={this.props.block}
        onActionClicked={this.onActionClicked}
      />
    );
  }
};

export default ActionsBlockPlayerContainer;