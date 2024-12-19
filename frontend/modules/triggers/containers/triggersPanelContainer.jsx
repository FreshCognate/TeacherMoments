import React, { Component } from 'react';
import TriggersPanel from '../components/triggersPanel';
import WithRouter from '~/core/app/components/withRouter';
import WithCache from '~/core/cache/containers/withCache';
import filter from 'lodash/filter';
import addModal from '~/core/dialogs/helpers/addModal';
import axios from 'axios';
import handleRequestError from '~/core/app/helpers/handleRequestError';
import find from 'lodash/find';
import pick from 'lodash/pick';

class TriggersPanelContainer extends Component {

  state = {
    slideEvent: 'ON_ENTER',
    blockEvent: 'ON_SHOW'
  }

  getSelectedType = () => {
    const params = new URLSearchParams(this.props.router.location.search);
    const blockId = params.get('block');
    if (blockId) return 'BLOCK';
    return 'SLIDE';
  }

  getTriggersByElementAndEvent = () => {
    const { params, location } = this.props.router;
    const urlParams = new URLSearchParams(location.search);

    const slideId = urlParams.get('slide');
    const blockId = urlParams.get('block');

    const elementRef = blockId ? blockId : slideId;

    const triggerType = blockId ? 'BLOCK' : 'SLIDE';

    const event = blockId ? this.state.blockEvent : this.state.slideEvent;

    return filter(this.props.triggers.data, (trigger) => {
      if (trigger.elementRef === elementRef && trigger.event === event && trigger.triggerType === triggerType) {
        return trigger;
      }
    })
  }

  getTriggerBaseModel = () => {
    const { params, location } = this.props.router;
    const scenario = params.id;

    const urlParams = new URLSearchParams(location.search);

    const slideId = urlParams.get('slide');
    const blockId = urlParams.get('block');

    const elementRef = blockId ? blockId : slideId;

    const event = blockId ? this.state.blockEvent : this.state.slideEvent;
    const triggerType = blockId ? 'BLOCK' : 'SLIDE';

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

  onEventChanged = (event) => {
    const { params, location } = this.props.router;

    const urlParams = new URLSearchParams(location.search);

    const blockId = urlParams.get('block');

    const eventKey = blockId ? 'blockEvent' : 'slideEvent';

    const stateUpdate = {};
    stateUpdate[eventKey] = event;

    this.setState(stateUpdate);

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
    const selectedType = this.getSelectedType();

    return (
      <TriggersPanel
        selectedType={selectedType}
        slideEvent={this.state.slideEvent}
        blockEvent={this.state.blockEvent}
        triggers={this.getTriggersByElementAndEvent()}
        onAddTriggerClicked={this.onAddTriggerClicked}
        onEventChanged={this.onEventChanged}
        onDeleteTriggerClicked={this.onDeleteTriggerClicked}
        onEditTriggerClicked={this.onEditTriggerClicked}
      />
    );
  }
};

export default WithRouter(WithCache(TriggersPanelContainer, {
  triggers: {
    url: '/api/triggers',
    getInitialData: () => ([]),
    transform: ({ data }) => data.triggers,
    getParams: ({ props }) => {
      return {
        scenario: props.router.params.id
      }
    },
    getQuery: ({ props }) => {
      return {
        scenario: props.router.params.id
      }
    }
  }
}));