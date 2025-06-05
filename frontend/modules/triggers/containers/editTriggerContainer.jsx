import React, { Component } from 'react';
import EditTrigger from '../components/editTrigger';
import getEditTriggerSchema from '../schemas/getEditTriggerSchema';
import WithCache from '~/core/cache/containers/withCache';
import getTrigger from '../helpers/getTrigger';
import find from 'lodash/find';

class EditTriggerContainer extends Component {

  getSchema = () => {
    const triggerName = this.props.modal.data.action;
    const trigger = getTrigger(triggerName);
    return {
      ...getEditTriggerSchema(),
      ...trigger.getSchema(this.props.modal.data)
    }
  }

  onFormUpdate = ({ update }) => {
    return this.props.modal.set(update);
  }

  render() {
    return (
      <EditTrigger
        model={this.props.modal.data}
        schema={this.getSchema()}
        onFormUpdate={this.onFormUpdate}
      />
    );
  }
};

export default WithCache(EditTriggerContainer, null, ['modal', 'triggers']);