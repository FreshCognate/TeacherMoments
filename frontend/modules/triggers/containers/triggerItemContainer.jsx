import React, { Component } from 'react';
import TriggerItem from '../components/triggerItem';
import getEditTriggerSchema from '../schemas/getEditTriggerSchema';
import getTrigger from '../helpers/getTrigger';
import getCache from '~/core/cache/helpers/getCache';
import axios from 'axios';
import handleRequestError from '~/core/app/helpers/handleRequestError';

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
    getCache('triggers').set(update, { setType: 'itemExtend', setFind: { _id: this.props.trigger._id } })
    axios.put(`/api/triggers/${this.props.trigger._id}`, update).then(() => {
      getCache('triggers').fetch();
    }).catch(handleRequestError);
  }

  render() {
    const triggerName = this.props.trigger.action;
    const trigger = getTrigger(triggerName);
    return (
      <TriggerItem
        trigger={this.props.trigger}
        schema={{
          ...getEditTriggerSchema(),
          ...trigger.getSchema(this.props.trigger)
        }}
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