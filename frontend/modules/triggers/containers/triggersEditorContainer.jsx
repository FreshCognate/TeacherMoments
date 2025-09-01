import React, { Component } from 'react';
import WithCache from '~/core/cache/containers/withCache';
import getFilteredTriggersByElement from '../helpers/getFilteredTriggersByElement';
import getEventDescription from '../helpers/getEventDescription';
import TriggersEditor from '../components/triggersEditor';
import addModal from '~/core/dialogs/helpers/addModal';
import axios from 'axios';
import handleRequestError from '~/core/app/helpers/handleRequestError';
import WithRouter from '~/core/app/components/withRouter';
import cloneDeep from 'lodash/cloneDeep';
import each from 'lodash/each';
import find from 'lodash/find';
import pick from 'lodash/pick';

class TriggersEditorContainer extends Component {

  getTriggers = () => {
    const { elementRef, triggerType } = this.props;
    return getFilteredTriggersByElement({ elementRef, triggerType });
  }

  getTriggerBaseModel = () => {
    const { params } = this.props.router;
    const scenario = params.id;

    const { elementRef, triggerType } = this.props;

    return {
      scenario,
      elementRef,
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
            value: 'SHOW_FEEDBACK_FROM_PROMPTS',
            text: 'Show feedback from prompts'
          }]
        },
        blocks: {
          type: 'TriggerBlocksSelector',
          label: 'Selected blocks:',
          blockTypes: ['INPUT_PROMPT', 'MULTIPLE_CHOICE_PROMPT']
        },
        conditions: {
          type: 'Conditions',
          label: 'Conditions',
          isInline: true,
        }
      },
      model: {
        action: 'SHOW_FEEDBACK_FROM_PROMPTS',
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
    console.log(trigger);
    addModal({
      title: 'Edit trigger',
      schema: {
        action: {
          type: 'Select',
          label: 'Action:',
          isInline: true,
          isDisabled: true,
          options: [{
            value: 'SHOW_FEEDBACK_FROM_PROMPTS',
            text: 'Show feedback from prompts'
          }]
        },
        blocks: {
          type: 'TriggerBlocksSelector',
          label: 'Selected blocks',
          blockTypes: ['INPUT_PROMPT', 'MULTIPLE_CHOICE_PROMPT']
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
  sortTriggers = ({ sourceIndex, destinationIndex }) => {
    const clonedTriggers = cloneDeep(this.getTriggers());
    const [removed] = clonedTriggers.splice(sourceIndex, 1);
    clonedTriggers.splice(destinationIndex, 0, removed);

    each(clonedTriggers, (item, index) => {
      item.sortOrder = index;
    });

    this.props.triggers.set(clonedTriggers, { setType: 'replace' });

    axios.put(`/api/triggers/${removed._id}`, { sourceIndex, destinationIndex }).then(() => {
      this.props.triggers.fetch();
    }).catch(handleRequestError);
  }

  onSortUpClicked = (sortOrder) => {
    const sourceIndex = sortOrder;
    const destinationIndex = sortOrder - 1;

    this.sortTriggers({ sourceIndex, destinationIndex });
  }

  onSortDownClicked = (sortOrder) => {

    const sourceIndex = sortOrder;
    const destinationIndex = sortOrder + 1;

    this.sortTriggers({ sourceIndex, destinationIndex });

  }

  render() {
    const { triggerType } = this.props;
    return (
      <TriggersEditor
        triggers={this.getTriggers()}
        eventDescription={getEventDescription({ triggerType })}
        onAddTriggerClicked={this.onAddTriggerClicked}
        onEditTriggerClicked={this.onEditTriggerClicked}
        onDeleteTriggerClicked={this.onDeleteTriggerClicked}
        onSortUpClicked={this.onSortUpClicked}
        onSortDownClicked={this.onSortDownClicked}
      />
    );
  }
};

export default WithRouter(WithCache(TriggersEditorContainer, null, ['triggers']));