import React, { Component } from 'react';
import ActionsPromptBlockPlayer from '../components/actionsPromptBlockPlayer';
import setSlideToComplete from '~/modules/tracking/helpers/setSlideToComplete';
import updateTracking from '~/modules/tracking/helpers/updateTracking';
import resetScenario from '~/modules/tracking/helpers/resetScenario';

class ActionsPromptBlockPlayerContainer extends Component {

  onActionClicked = (action) => {
    this.props.onUpdateTracking({ isComplete: true });
    switch (action.actionType) {
      case 'COMPLETE_SLIDE':
        setSlideToComplete({ slideRef: this.props.block.slideRef });
        break;
      case 'RESET_SCENARIO':
        resetScenario();
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