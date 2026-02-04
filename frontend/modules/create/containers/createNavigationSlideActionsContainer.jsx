import React, { Component } from 'react';
import CreateNavigationSlideActions from '../components/createNavigationSlideActions';
import getSlideErrors from '~/modules/slides/helpers/getSlideErrors';

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

  getSlideErrors = () => {
    return getSlideErrors(this.props.slide);
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
        slideErrors={this.getSlideErrors()}
        onSlideActionsToggle={this.onSlideActionsToggle}
        onSlideActionClicked={this.onSlideActionClicked}
      />
    );
  }
};

export default CreateNavigationSlideActionsContainer;