import React, { Component } from 'react';
import addSidePanel from '~/core/dialogs/helpers/addSidePanel';
import TriggersEditorContainer from './triggersEditorContainer';
import TriggerDisplay from '../components/triggerDisplay';
import WithCache from '~/core/cache/containers/withCache';
import filter from 'lodash/filter';
import addModal from '~/core/dialogs/helpers/addModal';
import WithRouter from '~/core/app/components/withRouter';
import axios from 'axios';
import handleRequestError from '~/core/app/helpers/handleRequestError';
import getTriggers from '../helpers/getTriggers';
import pick from 'lodash/pick';
import find from 'lodash/find';
import cloneDeep from 'lodash/cloneDeep';
import each from 'lodash/each';
import EditTriggerContainer from './editTriggerContainer';

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

    const triggers = getTriggers();

    addModal({
      title: 'Add new trigger',
      component: <EditTriggerContainer isEditing={false} />,
      model: {
        action: triggers[0].value,
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

  onEditTriggerClicked = (triggerId) => {

    const trigger = find(this.props.triggers.data, { _id: triggerId });
    const triggers = getTriggers();

    addModal({
      title: 'Edit trigger',
      component: <EditTriggerContainer isEditing={true} />,
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
        onEditTriggerClicked={this.onEditTriggerClicked}
        onDeleteTriggerClicked={this.onDeleteTriggerClicked}
        onSortUpClicked={this.onSortUpClicked}
        onSortDownClicked={this.onSortDownClicked}
      />
    );
  }
};

export default WithRouter(WithCache(TriggerDisplayContainer, null, ['triggers', 'slide']));