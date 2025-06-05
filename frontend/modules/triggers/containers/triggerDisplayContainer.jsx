import React, { Component } from 'react';
import addSidePanel from '~/core/dialogs/helpers/addSidePanel';
import TriggersEditorContainer from './triggersEditorContainer';
import getEventDescription from '../helpers/getEventDescription';
import TriggerDisplay from '../components/triggerDisplay';
import WithCache from '~/core/cache/containers/withCache';
import filter from 'lodash/filter';
import addModal from '~/core/dialogs/helpers/addModal';
import WithRouter from '~/core/app/components/withRouter';
import axios from 'axios';
import handleRequestError from '~/core/app/helpers/handleRequestError';

class TriggerDisplayContainer extends Component {

  getTriggers = () => {
    const { data } = this.props.triggers;
    return filter(data, (trigger) => trigger.elementRef === this.props.slide.data.ref && trigger.event === 'ON_EXIT');
  }

  getTriggerBaseModel = () => {
    const { params } = this.props.router;
    const scenario = params.id;

    return {
      scenario,
      elementRef: this.props.slide.data.ref,
      event: 'ON_EXIT',
      triggerType: 'SLIDE'
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

  onOpenTriggerPanelClicked = () => {
    addSidePanel({
      position: 'right',
      component: <TriggersEditorContainer elementRef={this.props.elementRef} event={this.props.event} triggerType={this.props.triggerType} />
    })
  }

  render() {
    return (
      <TriggerDisplay
        triggers={this.getTriggers()}
        onAddTriggerClicked={this.onAddTriggerClicked}
      />
    );
  }
};

export default WithRouter(WithCache(TriggerDisplayContainer, null, ['triggers', 'slide']));