import React, { Component } from 'react';
import WithCache from '~/core/cache/containers/withCache';
import getFilteredTriggersByElement from '../helpers/getFilteredTriggersByElement';
import getEventDescription from '../helpers/getEventDescription';
import TriggersEditor from '../components/triggersEditor';
import addModal from '~/core/dialogs/helpers/addModal';
import axios from 'axios';
import handleRequestError from '~/core/app/helpers/handleRequestError';
import WithRouter from '~/core/app/components/withRouter';

class TriggersEditorContainer extends Component {

  getTriggers = () => {
    const { elementRef, triggerType, event } = this.props;
    return getFilteredTriggersByElement({ elementRef, triggerType, event });
  }

  getTriggerBaseModel = () => {
    const { params } = this.props.router;
    const scenario = params.id;

    const { elementRef, event, triggerType } = this.props;

    return {
      scenario,
      elementRef,
      event,
      triggerType
    }
  }

  onAddTriggerClicked = () => {
    addModal({
      title: 'Add new trigger',
      schema: {
        action: {
          type: 'Select',
          label: 'Action:',
          isInline: true,
          options: [{
            value: 'HIDE_BLOCKS',
            text: 'Hide blocks'
          }, {
            value: 'SHOW_BLOCKS',
            text: 'Show blocks'
          }, {
            value: 'NAVIGATE_BY_PROMPTS',
            text: 'Navigate by prompts'
          }]
        },
        blocks: {
          type: 'TriggerBlocksSelector',
          label: 'Selected blocks:',
        },
        conditions: {
          type: 'Conditions',
          label: 'Conditions',
          isInline: true,
        }
      },
      model: {
        action: 'HIDE_BLOCKS',
        blocks: []
      },
      actions: [{
        type: 'CANCEL',
        text: 'Cancel'
      }, {
        type: 'CREATE',
        text: 'Create',
        color: 'primary'
      }]
    }, (state, { type, modal }) => {
      if (state === 'ACTION') {
        if (type === 'CREATE') {
          const triggerBaseModel = this.getTriggerBaseModel();
          axios.post('/api/triggers', { ...triggerBaseModel, ...modal }).then(() => {
            this.props.triggers.fetch();
          }).catch(handleRequestError);
        }
      }
    })
  }

  onDeleteTriggerClicked = (triggerId) => {
    axios.delete(`/api/triggers/${triggerId}`).then(() => {
      this.props.triggers.fetch();
    }).catch(handleRequestError);
  }

  onEditTriggerClicked = (triggerId) => {
    const trigger = find(this.props.triggers.data, { _id: triggerId });
    addModal({
      title: 'Edit trigger',
      schema: {
        action: {
          type: 'Select',
          label: 'Action:',
          isInline: true,
          isDisabled: true,
          options: [{
            value: 'HIDE_BLOCKS',
            text: 'Hide blocks'
          }]
        },
        blocks: {
          type: 'TriggerBlocksSelector',
          label: 'Selected blocks',
        },
        conditions: {
          type: 'Conditions',
          label: 'Conditions',
          isInline: true,
        }
      },
      model: trigger,
      actions: [{
        type: 'CANCEL',
        text: 'Cancel'
      }, {
        type: 'SAVE',
        text: 'Save',
        color: 'primary'
      }]
    }, (state, { type, modal }) => {
      if (state === 'ACTION') {
        if (type === 'SAVE') {
          axios.put(`/api/triggers/${triggerId}`, pick(modal, ['blocks', 'conditions'])).then(() => {
            this.props.triggers.fetch();
          }).catch(handleRequestError);
        }
      }
    })
  }

  render() {
    const { event, triggerType } = this.props;
    return (
      <TriggersEditor
        triggers={this.getTriggers()}
        eventDescription={getEventDescription({ event, triggerType })}
        onAddTriggerClicked={this.onAddTriggerClicked}
        onEditTriggerClicked={this.onEditTriggerClicked}
        onDeleteTriggerClicked={this.onDeleteTriggerClicked}
      />
    );
  }
};

export default WithRouter(WithCache(TriggersEditorContainer, null, ['triggers']));