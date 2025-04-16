import React, { Component } from 'react';
import CreateNavigationSlideActions from '../components/createNavigationSlideActions';

class CreateNavigationSlideActionsContainer extends Component {

  state = {
    isOptionsOpen: false
  }

  getOptions = () => {
    const options = [{
      icon: 'copy',
      text: 'Duplicate slide',
      color: 'primary',
      action: 'DUPLICATE'
    }];
    if (this.props.canDeleteSlides) {
      options.push({
        icon: 'delete',
        text: 'Delete slide',
        color: 'warning',
        action: 'DELETE'
      });
    }
    return options;
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
      case 'DUPLICATE':
        this.props.onDuplicateSlideClicked();
    }
  }

  render() {
    return (
      <CreateNavigationSlideActions
        slideNumber={this.props.slideNumber}
        isOptionsOpen={this.state.isOptionsOpen}
        options={this.getOptions()}
        onSlideActionsToggle={this.onSlideActionsToggle}
        onSlideActionClicked={this.onSlideActionClicked}
      />
    );
  }
};

export default CreateNavigationSlideActionsContainer;