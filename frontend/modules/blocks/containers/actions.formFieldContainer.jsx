import React, { Component } from 'react';
import registerField from '~/core/forms/helpers/registerField';
import ActionsFormField from '../components/actions.formField';
import remove from 'lodash/remove';
import find from 'lodash/find';
import extend from 'lodash/extend';

class ActionsFormFieldContainer extends Component {

  sortActions = ({ sourceIndex, destinationIndex }) => {
    const [removed] = this.props.value.splice(sourceIndex, 1);
    this.props.value.splice(destinationIndex, 0, removed);
    this.props.updateField(this.props.value);
  }

  onUpdateAction = (actionId, { update }) => {
    const currentAction = find(this.props.value, { _id: actionId });
    extend(currentAction, update);
    this.props.updateField(this.props.value);
  }

  onAddActionClicked = () => {
    this.props.value.push({});
    this.props.updateField(this.props.value);
  }

  onRemoveActionClicked = (actionId) => {
    remove(this.props.value, { _id: actionId });
    this.props.updateField(this.props.value);
  }

  onSortActionUpClicked = (sortOrder) => {
    const sourceIndex = sortOrder;
    const destinationIndex = sortOrder - 1;
    this.sortActions({ sourceIndex, destinationIndex });
  }

  onSortActionDownClicked = (sortOrder) => {
    const sourceIndex = sortOrder;
    const destinationIndex = sortOrder + 1;
    this.sortActions({ sourceIndex, destinationIndex });
  }

  render() {
    const { value, schema } = this.props;
    return (
      <ActionsFormField
        schema={schema}
        value={value}
        onUpdateAction={this.onUpdateAction}
        onAddActionClicked={this.onAddActionClicked}
        onRemoveActionClicked={this.onRemoveActionClicked}
        onSortActionUpClicked={this.onSortActionUpClicked}
        onSortActionDownClicked={this.onSortActionDownClicked}
      />
    );
  }
};

registerField('Actions', ActionsFormFieldContainer);