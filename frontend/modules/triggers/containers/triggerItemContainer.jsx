import React, { Component } from 'react';
import TriggerItem from '../components/triggerItem';
import getTrigger from '../helpers/getTrigger';
import WithCache from '~/core/cache/containers/withCache';
import find from 'lodash/find';
import getCache from '~/core/cache/helpers/getCache';

class TriggerItemContainer extends Component {

  state = {
    isOptionsOpen: false
  }

  onToggleActionsClicked = (isOptionsOpen) => {
    this.setState({ isOptionsOpen });
  }

  onActionClicked = (action) => {
    this.setState({ isOptionsOpen: false });
    if (action === 'DELETE') {
      this.props.onDeleteTriggerClicked(this.props.trigger._id);
    }
  }

  onFormUpdate = ({ update }) => {
    getCache('triggers').mutate(update, {
      method: 'put',
      url: `/api/triggers/${this.props.trigger._id}`,
      setType: 'itemExtend',
      setFind: { _id: this.props.trigger._id },
      transform: ({ data }) => {
        return data.trigger
      }
    });
  }

  render() {
    const triggerName = this.props.trigger.action;
    const trigger = getTrigger(triggerName);
    return (
      <TriggerItem
        trigger={this.props.trigger}
        schema={trigger.getSchema(this.props.trigger)}
        isLastTrigger={this.props.isLastTrigger}
        isOptionsOpen={this.state.isOptionsOpen}
        onDeleteTriggerClicked={this.props.onDeleteTriggerClicked}
        onSortUpClicked={this.props.onSortUpClicked}
        onSortDownClicked={this.props.onSortDownClicked}
        onToggleActionsClicked={this.onToggleActionsClicked}
        onActionClicked={this.onActionClicked}
        onFormUpdate={this.onFormUpdate}
      />
    );
  }
};

export default TriggerItemContainer;