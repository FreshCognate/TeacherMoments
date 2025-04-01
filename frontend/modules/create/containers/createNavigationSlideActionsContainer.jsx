import React, { Component } from 'react';
import CreateNavigationSlideActions from '../components/createNavigationSlideActions';

class CreateNavigationSlideActionsContainer extends Component {

  state = {
    isOptionsOpen: false
  }


  onSlideActionsToggle = (isOptionsOpen) => {
    this.setState({ isOptionsOpen })
  }

  onSlideActionClicked = (action) => {
    this.setState({ isOptionsOpen: false });
    switch (action) {
      case 'DELETE':
        this.props.onDeleteSlideClicked();
        break;
    }
  }

  render() {
    return (
      <CreateNavigationSlideActions
        slideNumber={this.props.slideNumber}
        isOptionsOpen={this.state.isOptionsOpen}
        onSlideActionsToggle={this.onSlideActionsToggle}
        onSlideActionClicked={this.onSlideActionClicked}
      />
    );
  }
};

export default CreateNavigationSlideActionsContainer;