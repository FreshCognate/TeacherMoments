import React, { Component } from 'react';
import AddTrigger from '../components/addTrigger';
import getTriggers from '../helpers/getTriggers';
import WithCache from '~/core/cache/containers/withCache';

class AddTriggerContainer extends Component {

  onAddTriggerClicked = (action) => {
    this.props.modal.set({ action }).then(() => {
      this.props.actions.onActionClicked('CREATE')
    });
  }

  render() {
    return (
      <AddTrigger
        triggers={getTriggers()}
        onAddTriggerClicked={this.onAddTriggerClicked}
      />
    );
  }
};

export default WithCache(AddTriggerContainer, null, ['modal']);