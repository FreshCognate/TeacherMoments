import React, { Component } from 'react';
import ActionsPromptBlockPlayer from '../components/actionsPromptBlockPlayer';
import setSlideToComplete from '~/modules/tracking/helpers/setSlideToComplete';

class ActionsPromptBlockPlayerContainer extends Component {

  onActionClicked = (action) => {
    console.log(action);
    switch (action.actionType) {
      case 'COMPLETE_SLIDE':
        console.log('Should complete slide');
        setSlideToComplete({ slideRef: this.props.block.slideRef });
        break;
      case 'RESTART_SCENARIO':
        console.log('Should restart scenario');
        break;
    }
  }

  render() {
    return (
      <ActionsPromptBlockPlayer
        block={this.props.block}
        onActionClicked={this.onActionClicked}
      />
    );
  }
};

export default ActionsPromptBlockPlayerContainer;