import React, { Component } from 'react';
import TriggerDisplay from '../components/triggerDisplay';
import WithCache from '~/core/cache/containers/withCache';
import filter from 'lodash/filter';
import addModal from '~/core/dialogs/helpers/addModal';
import WithRouter from '~/core/app/components/withRouter';
import axios from 'axios';
import handleRequestError from '~/core/app/helpers/handleRequestError';
import getTriggers from '../helpers/getTriggers';
import cloneDeep from 'lodash/cloneDeep';
import each from 'lodash/each';
import AddTriggerContainer from './addTriggerContainer';

class TriggerDisplayContainer extends Component {

  getTriggers = () => {
    const { data } = this.props.triggers;
    return filter(data, (trigger) => trigger.elementRef === this.props.slide.data?.ref);
  }

  getTriggerBaseModel = () => {
    const { params } = this.props.router;
    const scenario = params.id;

    return {
      scenario,
      elementRef: this.props.slide.data.ref,
      triggerType: 'SLIDE'
    }
  }

  onAddTriggerClicked = () => {

    const triggers = getTriggers();

    addModal({
      title: 'Add new trigger',
      body: "Select a trigger type to provide feedback when users respond to prompts on this slide. Triggers are only activated when the slide contains input prompts (e.g., Multiple Choice or Input Prompt blocks).",
      component: <AddTriggerContainer />,
      actions: [{
        type: 'CANCEL',
        text: 'Cancel'
      }]
    }, (state, { type, modal }) => {
      if (state === 'ACTION') {
        if (type === 'CREATE') {
          const triggerBaseModel = this.getTriggerBaseModel();
          axios.post('/api/triggers', { ...triggerBaseModel, ...modal }).then((response) => {
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
    return (
      <TriggerDisplay
        triggers={this.getTriggers()}
        onAddTriggerClicked={this.onAddTriggerClicked}
        onDeleteTriggerClicked={this.onDeleteTriggerClicked}
        onSortUpClicked={this.onSortUpClicked}
        onSortDownClicked={this.onSortDownClicked}
      />
    );
  }
};

export default WithRouter(WithCache(TriggerDisplayContainer, null, ['triggers', 'slide']));