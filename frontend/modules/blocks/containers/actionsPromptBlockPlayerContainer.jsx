import React, { Component } from 'react';
import ActionsPromptBlockPlayer from '../components/actionsPromptBlockPlayer';
import setSlideToComplete from '~/modules/run/helpers/setSlideToComplete';
import resetScenario from '~/modules/run/helpers/resetScenario';
import WithRouter from '~/core/app/components/withRouter';

class ActionsPromptBlockPlayerContainer extends Component {

  onActionClicked = (action) => {
    this.props.onUpdateBlockTracking({ isComplete: true, isAbleToComplete: true });
    switch (action.actionType) {
      case 'COMPLETE_SLIDE':
        setSlideToComplete({ slideRef: this.props.block.slideRef });
        break;
      case 'RESET_SCENARIO':
        resetScenario({ router: this.props.router });
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

export default WithRouter(ActionsPromptBlockPlayerContainer);